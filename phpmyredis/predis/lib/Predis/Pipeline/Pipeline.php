<?php

/*
 * This file is part of the Predis package.
 *
 * (c) Daniele Alessandri <suppakilla@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Predis\Pipeline;

use Exception;
use InvalidArgumentException;
use SplQueue;
use Predis\BasicClientInterface;
use Predis\ClientException;
use Predis\ClientInterface;
use Predis\ExecutableContextInterface;
use Predis\Command\CommandInterface;
use Predis\Connection\ConnectionInterface;
use Predis\Connection\ReplicationConnectionInterface;
use Predis\Response;

/**
 * Implementation of a command pipeline in which write and read operations of
 * Redis commands are pipelined to alleviate the effects of network round-trips.
 *
 * @author Daniele Alessandri <suppakilla@gmail.com>
 */
class Pipeline implements BasicClientInterface, ExecutableContextInterface
{
    private $client;
    private $pipeline;

    private $responses = array();
    private $running = false;

    /**
     * @param ClientInterface $client Client instance used by the context.
     */
    public function __construct(ClientInterface $client)
    {
        $this->client = $client;
        $this->pipeline = new SplQueue();
    }

    /**
     * Queues a command into the pipeline buffer.
     *
     * @param string $method Command ID.
     * @param array $arguments Arguments for the command.
     * @return Pipeline
     */
    public function __call($method, $arguments)
    {
        $command = $this->client->createCommand($method, $arguments);
        $this->recordCommand($command);

        return $this;
    }

    /**
     * Queues a command instance into the pipeline buffer.
     *
     * @param CommandInterface $command Command to queue in the buffer.
     */
    protected function recordCommand(CommandInterface $command)
    {
        $this->pipeline->enqueue($command);
    }

    /**
     * Queues a command instance into the pipeline buffer.
     *
     * @param CommandInterface $command Command to queue in the buffer.
     */
    public function executeCommand(CommandInterface $command)
    {
        $this->recordCommand($command);
    }

    /**
     * Throws and exception on -ERR responses returned by Redis.
     *
     * @param ConnectionInterface $connection The connection that returned the error.
     * @param Response\ErrorInterface $response The error response instance.
     */
    protected function exception(ConnectionInterface $connection, Response\ErrorInterface $response)
    {
        $connection->disconnect();
        $message = $response->getMessage();

        throw new Response\ServerException($message);
    }

    /**
     * Implements the logic to flush the queued commands and read the responses
     * from the current connection.
     *
     * @param ConnectionInterface $connection Current connection instance.
     * @param SplQueue $commands Queued commands.
     * @return array
     */
    protected function executePipeline(ConnectionInterface $connection, SplQueue $commands)
    {
        if ($connection instanceof ReplicationConnectionInterface) {
            $connection->switchTo('master');
        }

        foreach ($commands as $command) {
            $connection->writeCommand($command);
        }

        $responses  = array();
        $exceptions = $this->throwServerExceptions();

        while (!$commands->isEmpty()) {
            $command  = $commands->dequeue();
            $response = $connection->readResponse($command);

            if (!$response instanceof Response\ObjectInterface) {
                $responses[] = $command->parseResponse($response);
            } else if ($response instanceof Response\ErrorInterface && $exceptions) {
                $this->exception($connection, $response);
            } else {
                $responses[] = $response;
            }
        }

        return $responses;
    }

    /**
     * Flushes the buffer that holds the queued commands.
     *
     * @param bool $send Specifies if the commands in the buffer should be sent to Redis.
     * @return Pipeline
     */
    public function flushPipeline($send = true)
    {
        if ($send && !$this->pipeline->isEmpty()) {
            $connection = $this->client->getConnection();
            $responses = $this->executePipeline($connection, $this->pipeline);

            $this->responses = array_merge($this->responses, $responses);
        } else {
            $this->pipeline = new SplQueue();
        }

        return $this;
    }

    /**
     * Marks the running status of the pipeline.
     *
     * @param bool $bool Sets the running status of the pipeline.
     */
    private function setRunning($bool)
    {
        if ($bool && $this->running) {
            throw new ClientException('This pipeline is already opened');
        }

        $this->running = $bool;
    }

    /**
     * Handles the actual execution of the whole pipeline.
     *
     * @param mixed $callable Optional callback for execution.
     * @return array
     */
    public function execute($callable = null)
    {
        if ($callable && !is_callable($callable)) {
            throw new InvalidArgumentException('Argument passed must be a callable object');
        }

        $exception = null;
        $this->setRunning(true);

        try {
            if ($callable) {
                call_user_func($callable, $this);
            }

            $this->flushPipeline();
        } catch (Exception $exception) {
            // NOOP
        }

        $this->setRunning(false);

        if ($exception) {
            throw $exception;
        }

        return $this->responses;
    }

    /**
     * Returns if the pipeline should throw exceptions on server errors.
     *
     * @todo Awful naming...
     * @return bool
     */
    protected function throwServerExceptions()
    {
        return (bool) $this->client->getOptions()->exceptions;
    }

    /**
     * Returns the underlying client instance used by the pipeline object.
     *
     * @return ClientInterface
     */
    public function getClient()
    {
        return $this->client;
    }
}
