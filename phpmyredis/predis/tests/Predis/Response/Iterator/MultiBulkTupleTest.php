<?php

/*
 * This file is part of the Predis package.
 *
 * (c) Daniele Alessandri <suppakilla@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Predis\Response\Iterator;

use PHPUnit_Framework_TestCase as StandardTestCase;

use Predis\Client;
use Predis\Connection\ComposableStreamConnection;
use Predis\Connection\ConnectionParameters;
use Predis\Protocol\Text\ProtocolProcessor as TextProtocolProcessor;

/**
 * @group realm-iterators
 */
class MultiBulkTupleTest extends StandardTestCase
{
    /**
     * @group disconnected
     * @expectedException RuntimeException
     * @expectedExceptionMessage Cannot initialize a tuple iterator with an already initiated iterator
     */
    public function testInitiatedMultiBulkIteratorsAreNotValid()
    {
        $connection = $this->getMock('Predis\Connection\SingleConnectionInterface');
        $iterator = new MultiBulk($connection, 2);
        $iterator->next();

        new MultiBulkTuple($iterator);
    }

    /**
     * @group disconnected
     * @expectedException UnexpectedValueException
     * @expectedExceptionMessage Invalid response size for a tuple iterator [3]
     */
    public function testMultiBulkWithOddSizesAreInvalid()
    {
        $connection = $this->getMock('Predis\Connection\SingleConnectionInterface');
        $iterator = new MultiBulk($connection, 3);

        new MultiBulkTuple($iterator);
    }

    /**
     * @group connected
     */
    public function testIterableMultibulk()
    {
        $client = $this->getClient();
        $client->zadd('metavars', 1, 'foo', 2, 'hoge', 3, 'lol');

        $this->assertInstanceOf('OuterIterator', $iterator = $client->zrange('metavars', 0, -1, 'withscores')->asTuple());
        $this->assertInstanceOf('Predis\Response\Iterator\MultiBulkTuple', $iterator);
        $this->assertInstanceOf('Predis\Response\Iterator\MultiBulk', $iterator->getInnerIterator());
        $this->assertTrue($iterator->valid());
        $this->assertSame(3, $iterator->count());

        $this->assertSame(array('foo', '1'), $iterator->current());
        $this->assertSame(1, $iterator->next());
        $this->assertTrue($iterator->valid());

        $this->assertSame(array('hoge', '2'), $iterator->current());
        $this->assertSame(2, $iterator->next());
        $this->assertTrue($iterator->valid());

        $this->assertSame(array('lol', '3'), $iterator->current());
        $this->assertSame(3, $iterator->next());
        $this->assertFalse($iterator->valid());

        $this->assertTrue($client->ping());
    }

    /**
     * @group connected
     */
    public function testGarbageCollectorDropsUnderlyingConnection()
    {
        $client = $this->getClient();
        $client->zadd('metavars', 1, 'foo', 2, 'hoge', 3, 'lol');

        $iterator = $client->zrange('metavars', 0, -1, 'withscores')->asTuple();

        unset($iterator);

        $this->assertFalse($client->isConnected());
        $this->assertTrue($client->ping());
    }

    // ******************************************************************** //
    // ---- HELPER METHODS ------------------------------------------------ //
    // ******************************************************************** //

    /**
     * Returns a new client instance.
     *
     * @return Client
     */
    protected function getClient()
    {
        $parameters = new ConnectionParameters(array(
            'host' => REDIS_SERVER_HOST,
            'port' => REDIS_SERVER_PORT,
            'read_write_timeout' => 2,
        ));

        $options = array(
            'profile' => REDIS_SERVER_VERSION,
        );

        $protocol = new TextProtocolProcessor();
        $protocol->useIterableMultibulk(true);

        $connection = new ComposableStreamConnection($parameters, $protocol);

        $client = new Client($connection, $options);
        $client->connect();
        $client->select(REDIS_SERVER_DBNUM);
        $client->flushdb();

        return $client;
    }

}
