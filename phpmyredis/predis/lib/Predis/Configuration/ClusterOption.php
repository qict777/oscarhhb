<?php

/*
 * This file is part of the Predis package.
 *
 * (c) Daniele Alessandri <suppakilla@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Predis\Configuration;

use InvalidArgumentException;
use Predis\Connection\ClusterConnectionInterface;
use Predis\Connection\PredisCluster;
use Predis\Connection\RedisCluster;

/**
 * Configures an aggregate connection used for clustering
 * multiple Redis nodes using various implementations with
 * different algorithms or strategies.
 *
 * @author Daniele Alessandri <suppakilla@gmail.com>
 */
class ClusterOption implements OptionInterface
{
    /**
     * Creates a new cluster connection from on a known descriptive name.
     *
     * @param OptionsInterface $options Instance of the client options.
     * @param string $id Descriptive identifier of the cluster type (`predis`, `redis-cluster`)
     * @return ClusterConnectionInterface
     */
    protected function createByDescription(OptionsInterface $options, $id)
    {
        switch ($id) {
            case 'predis':
            case 'predis-cluster':
                return new PredisCluster();

            case 'redis':
            case 'redis-cluster':
                return new RedisCluster($options->connections);

        }
    }

    /**
     * {@inheritdoc}
     */
    public function filter(OptionsInterface $options, $value)
    {
        if (is_string($value)) {
            $value = $this->createByDescription($options, $value);
        }

        if (!$value instanceof ClusterConnectionInterface) {
            throw new InvalidArgumentException('Instance of Predis\Connection\ClusterConnectionInterface expected');
        }

        return $value;
    }

    /**
     * {@inheritdoc}
     */
    public function getDefault(OptionsInterface $options)
    {
        return new PredisCluster();
    }
}
