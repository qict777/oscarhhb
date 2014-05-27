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

use PHPUnit_Framework_TestCase as StandardTestCase;

use Predis\Client;
use Predis\ClientException;
use Predis\Profile\ServerProfile;
use Predis\Response;

/**
 *
 */
class PipelineTest extends StandardTestCase
{
    /**
     * @group disconnected
     */
    public function testConstructor()
    {
        $client = new Client();
        $pipeline = new Pipeline($client);

        $this->assertSame($client, $pipeline->getClient());
    }

    /**
     * @group disconnected
     */
    public function testCallDoesNotSendCommandsWithoutExecute()
    {
        $connection = $this->getMock('Predis\Connection\SingleConnectionInterface');
        $connection->expects($this->never())->method('writeCommand');
        $connection->expects($this->never())->method('readResponse');

        $pipeline = new Pipeline(new Client($connection));

        $pipeline->echo('one');
        $pipeline->echo('two');
        $pipeline->echo('three');
    }

    /**
     * @group disconnected
     */
    public function testCallReturnsPipelineForFluentInterface()
    {
        $connection = $this->getMock('Predis\Connection\SingleConnectionInterface');
        $connection->expects($this->never())->method('writeCommand');
        $connection->expects($this->never())->method('readResponse');

        $pipeline = new Pipeline(new Client($connection));

        $this->assertSame($pipeline, $pipeline->echo('one'));
        $this->assertSame($pipeline, $pipeline->echo('one')->echo('two')->echo('three'));
    }

    /**
     * @group disconnected
     */
    public function testDoesNotParseComplexResponseObjects()
    {
        $object = $this->getMock('Predis\Response\ObjectInterface');

        $connection = $this->getMock('Predis\Connection\SingleConnectionInterface');
        $connection->expects($this->once())
                   ->method('readResponse')
                   ->will($this->returnValue($object));

        $pipeline = new Pipeline(new Client($connection));

        $pipeline->ping();

        $this->assertSame(array($object), $pipeline->execute());
    }

    /**
     * @group disconnected
     * @expectedException Predis\Response\ServerException
     * @expectedExceptionMessage ERR Test error
     */
    public function testThrowsServerExceptionOnResponseErrorByDefault()
    {
        $error = new Response\Error('ERR Test error');

        $connection = $this->getMock('Predis\Connection\SingleConnectionInterface');
        $connection->expects($this->once())
                   ->method('readResponse')
                   ->will($this->returnValue($error));

        $pipeline = new Pipeline(new Client($connection));

        $pipeline->ping();
        $pipeline->ping();

        $pipeline->execute();
    }

    /**
     * @group disconnected
     */
    public function testReturnsResponseErrorWithClientExceptionsSetToFalse()
    {
        $error = $this->getMock('Predis\Response\ErrorInterface');

        $connection = $this->getMock('Predis\Connection\SingleConnectionInterface');
        $connection->expects($this->exactly(2))
                   ->method('readResponse')
                   ->will($this->returnValue($error));

        $client = new Client($connection, array('exceptions' => false));

        $pipeline = new Pipeline($client);

        $pipeline->ping();
        $pipeline->ping();

        $this->assertSame(array($error, $error), $pipeline->execute());
    }

    /**
     * @group disconnected
     */
    public function testExecuteCommandDoesNotSendCommandsWithoutExecute()
    {
        $profile = ServerProfile::getDefault();

        $connection = $this->getMock('Predis\Connection\SingleConnectionInterface');
        $connection->expects($this->never())->method('writeCommand');
        $connection->expects($this->never())->method('readResponse');

        $pipeline = new Pipeline(new Client($connection));

        $pipeline->executeCommand($profile->createCommand('echo', array('one')));
        $pipeline->executeCommand($profile->createCommand('echo', array('two')));
        $pipeline->executeCommand($profile->createCommand('echo', array('three')));
    }

    /**
     * @group disconnected
     */
    public function testExecuteWithEmptyBuffer()
    {
        $connection = $this->getMock('Predis\Connection\SingleConnectionInterface');
        $connection->expects($this->never())->method('writeCommand');
        $connection->expects($this->never())->method('readResponse');

        $pipeline = new Pipeline(new Client($connection));

        $this->assertSame(array(), $pipeline->execute());
    }

    /**
     * @group disconnected
     */
    public function testExecuteWithFilledBuffer()
    {
        $connection = $this->getMock('Predis\Connection\SingleConnectionInterface');
        $connection->expects($this->exactly(3))
                   ->method('writeCommand');
        $connection->expects($this->exactly(3))
                   ->method('readResponse')
                   ->will($this->returnCallback($this->getReadCallback()));

        $pipeline = new Pipeline(new Client($connection));

        $pipeline->echo('one');
        $pipeline->echo('two');
        $pipeline->echo('three');

        $pipeline->flushPipeline();

        $this->assertSame(array('one', 'two', 'three'), $pipeline->execute());
    }

    /**
     * @group disconnected
     */
    public function testFlushWithFalseArgumentDiscardsBuffer()
    {
        $pipeline = new Pipeline(new Client());

        $pipeline->echo('one');
        $pipeline->echo('two');
        $pipeline->echo('three');

        $pipeline->flushPipeline(false);

        $this->assertSame(array(), $pipeline->execute());
    }

    /**
     * @group disconnected
     */
    public function testFlushHandlesPartialBuffers()
    {
        $connection = $this->getMock('Predis\Connection\SingleConnectionInterface');
        $connection->expects($this->exactly(4))
                   ->method('writeCommand');
        $connection->expects($this->exactly(4))
                   ->method('readResponse')
                   ->will($this->returnCallback($this->getReadCallback()));

        $pipeline = new Pipeline(new Client($connection));

        $pipeline->echo('one');
        $pipeline->echo('two');
        $pipeline->flushPipeline();
        $pipeline->echo('three');
        $pipeline->echo('four');

        $this->assertSame(array('one', 'two', 'three', 'four'), $pipeline->execute());
    }

    /**
     * @group disconnected
     */
    public function testSwitchesToMasterWithReplicationConnection()
    {
        $connection = $this->getMock('Predis\Connection\ReplicationConnectionInterface');
        $connection->expects($this->once())
                   ->method('switchTo')
                   ->with('master');
        $connection->expects($this->exactly(3))
                   ->method('writeCommand');
        $connection->expects($this->exactly(3))
                   ->method('readResponse')
                   ->will($this->returnValue('PONG'));

        $pipeline = new Pipeline(new Client($connection));

        $pipeline->ping();
        $pipeline->ping();
        $pipeline->ping();

        $this->assertSame(array(true, true, true), $pipeline->execute());
    }

    /**
     * @group disconnected
     */
    public function testExecuteAcceptsCallableArgument()
    {
        $test = $this;
        $pipeline = new Pipeline(new Client());

        $callable = function ($pipe) use ($test, $pipeline) {
            $test->assertSame($pipeline, $pipe);
            $pipe->flushPipeline(false);
        };

        $pipeline->execute($callable);
    }

    /**
     * @group disconnected
     * @expectedException InvalidArgumentException
     */
    public function testExecuteDoesNotAcceptNonCallableArgument()
    {
        $noncallable = new \stdClass();

        $pipeline = new Pipeline(new Client());
        $pipeline->execute($noncallable);
    }

    /**
     * @group disconnected
     * @expectedException Predis\ClientException
     */
    public function testExecuteInsideCallableArgumentThrowsException()
    {
        $pipeline = new Pipeline(new Client());

        $pipeline->execute(function ($pipe) {
            $pipe->execute();
        });
    }

    /**
     * @group disconnected
     */
    public function testExecuteWithCallableArgumentRunsPipelineInCallable()
    {
        $connection = $this->getMock('Predis\Connection\SingleConnectionInterface');
        $connection->expects($this->exactly(4))
                   ->method('writeCommand');
        $connection->expects($this->exactly(4))
                   ->method('readResponse')
                   ->will($this->returnCallback($this->getReadCallback()));

        $pipeline = new Pipeline(new Client($connection));

        $replies = $pipeline->execute(function ($pipe) {
            $pipe->echo('one');
            $pipe->echo('two');
            $pipe->echo('three');
            $pipe->echo('four');
        });

        $this->assertSame(array('one', 'two', 'three', 'four'), $replies);
    }

    /**
     * @group disconnected
     */
    public function testExecuteWithCallableArgumentHandlesExceptions()
    {
        $connection = $this->getMock('Predis\Connection\SingleConnectionInterface');
        $connection->expects($this->never())->method('writeCommand');
        $connection->expects($this->never())->method('readResponse');

        $pipeline = new Pipeline(new Client($connection));

        $exception = null;
        $replies = null;

        try {
            $replies = $pipeline->execute(function ($pipe) {
                $pipe->echo('one');
                throw new ClientException('TEST');
                $pipe->echo('two');
            });
        } catch (\Exception $ex) {
            $exception = $ex;
        }

        $this->assertInstanceOf('Predis\ClientException', $exception);
        $this->assertSame('TEST', $exception->getMessage());
        $this->assertNull($replies);
    }

    // ******************************************************************** //
    // ---- INTEGRATION TESTS --------------------------------------------- //
    // ******************************************************************** //

    /**
     * @group connected
     */
    public function testIntegrationWithFluentInterface()
    {
        $pipeline = $this->getClient()->pipeline();

        $results = $pipeline->echo('one')
                            ->echo('two')
                            ->echo('three')
                            ->execute();

        $this->assertSame(array('one', 'two', 'three'), $results);
    }

    /**
     * @group connected
     */
    public function testIntegrationWithCallableBlock()
    {
        $client = $this->getClient();

        $results = $client->pipeline(function ($pipe) {
            $pipe->set('foo', 'bar');
            $pipe->get('foo');
        });

        $this->assertSame(array(true, 'bar'), $results);
        $this->assertTrue($client->exists('foo'));
    }

    /**
     * @group connected
     */
    public function testOutOfBandMessagesInsidePipeline()
    {
        $oob = null;
        $client = $this->getClient();

        $results = $client->pipeline(function ($pipe) use (&$oob) {
            $pipe->set('foo', 'bar');
            $oob = $pipe->getClient()->echo('oob message');
            $pipe->get('foo');
        });

        $this->assertSame(array(true, 'bar'), $results);
        $this->assertSame('oob message', $oob);
        $this->assertTrue($client->exists('foo'));
    }

    /**
     * @group connected
     */
    public function testIntegrationWithClientExceptionInCallableBlock()
    {
        $client = $this->getClient();

        try {
            $client->pipeline(function ($pipe) {
                $pipe->set('foo', 'bar');
                throw new ClientException('TEST');
            });
        } catch (\Exception $ex) {
            $exception = $ex;
        }

        $this->assertInstanceOf('Predis\ClientException', $exception);
        $this->assertSame('TEST', $exception->getMessage());
        $this->assertFalse($client->exists('foo'));
    }

    /**
     * @group connected
     */
    public function testIntegrationWithServerExceptionInCallableBlock()
    {
        $client = $this->getClient();

        try {
            $client->pipeline(function ($pipe) {
                $pipe->set('foo', 'bar');
                // LPUSH on a string key fails, but won't stop
                // the pipeline to send the commands.
                $pipe->lpush('foo', 'bar');
                $pipe->set('hoge', 'piyo');
            });
        } catch (\Exception $ex) {
            $exception = $ex;
        }

        $this->assertInstanceOf('Predis\Response\ServerException', $exception);
        $this->assertTrue($client->exists('foo'));
        $this->assertTrue($client->exists('hoge'));
    }

    /**
     * @group connected
     */
    public function testIntegrationWithServerErrorInCallableBlock()
    {
        $client = $this->getClient(array(), array('exceptions' => false));

        $results = $client->pipeline(function ($pipe) {
            $pipe->set('foo', 'bar');
            $pipe->lpush('foo', 'bar'); // LPUSH on a string key fails.
            $pipe->get('foo');
        });

        $this->assertTrue($results[0]);
        $this->assertInstanceOf('Predis\Response\Error', $results[1]);
        $this->assertSame('bar', $results[2]);
    }

    // ******************************************************************** //
    // ---- HELPER METHODS ------------------------------------------------ //
    // ******************************************************************** //

    /**
     * Returns a client instance connected to the specified Redis
     * server instance to perform integration tests.
     *
     * @return array Additional connection parameters.
     * @return array Additional client options.
     * @return Client New client instance.
     */
    protected function getClient(array $parameters = array(), array $options = array())
    {
        $parameters = array_merge(array(
            'scheme' => 'tcp',
            'host' => REDIS_SERVER_HOST,
            'port' => REDIS_SERVER_PORT,
            'database' => REDIS_SERVER_DBNUM,
        ), $parameters);

        $options = array_merge(array(
            'profile' => REDIS_SERVER_VERSION,
        ), $options);

        $client = new Client($parameters, $options);

        $client->connect();
        $client->flushdb();

        return $client;
    }

    /**
     * Helper method that returns a callback used to emulate a reply
     * to an ECHO command.
     *
     * @return \Closure
     */
    protected function getReadCallback()
    {
        return function ($command) {
            if (($id = $command->getId()) !== 'ECHO') {
                throw new \InvalidArgumentException("Expected ECHO, got {$id}");
            }

            list($echoed) = $command->getArguments();

            return $echoed;
        };
    }
}
