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
use PHPUnit_Framework_TestCase as StandardTestCase;
use stdClass;

use Predis\Command\Processor\KeyPrefixProcessor;
use Predis\Profile\ServerProfile;

/**
 *
 */
class ProfileOptionTest extends StandardTestCase
{
    /**
     * @group disconnected
     */
    public function testDefaultOptionValue()
    {
        $option = new ProfileOption();
        $options = $this->getMock('Predis\Configuration\OptionsInterface');

        $profile = $option->getDefault($options);

        $this->assertInstanceOf('Predis\Profile\ServerProfileInterface', $profile);
        $this->assertInstanceOf(get_class(ServerProfile::getDefault()), $profile);
        $this->assertNull($profile->getProcessor());
    }

    /**
     * @group disconnected
     */
    public function testAcceptsServerProfileInstanceAsValue()
    {
        $option = new ProfileOption();
        $options = $this->getMock('Predis\Configuration\OptionsInterface');
        $value = ServerProfile::get('2.0');

        $profile = $option->filter($options, $value);

        $this->assertSame($profile, $value);
        $this->assertNull($profile->getProcessor());
    }

    /**
     * @group disconnected
     */
    public function testAcceptsStringInterpretedAsServerProfileVersion()
    {
        $option = new ProfileOption();
        $options = $this->getMock('Predis\Configuration\OptionsInterface');

        $profile = $option->filter($options, '2.0');

        $this->assertInstanceOf('Predis\Profile\ServerProfileInterface', $profile);
        $this->assertEquals('2.0', $profile->getVersion());
        $this->assertNull($profile->getProcessor());
    }

    /**
     * @group disconnected
     */
    public function testAppliesPrefixOnDefaultOptionValue()
    {
        $option = new ProfileOption();
        $options = $this->getMock('Predis\Configuration\OptionsInterface');

        $options->expects($this->once())
                ->method('__isset')
                ->with('prefix')
                ->will($this->returnValue(true));
        $options->expects($this->once())
                ->method('__get')
                ->with('prefix')
                ->will($this->returnValue(new KeyPrefixProcessor('prefix:')));

        $profile = $option->getDefault($options);

        $this->assertInstanceOf('Predis\Profile\ServerProfileInterface', $profile);
        $this->assertInstanceOf(get_class(ServerProfile::getDefault()), $profile);

        $this->assertInstanceOf('Predis\Command\Processor\KeyPrefixProcessor', $profile->getProcessor());
        $this->assertSame('prefix:', $profile->getProcessor()->getPrefix());
    }

    /**
     * @group disconnected
     */
    public function testAppliesPrefixOnProfileCreatedFromStringValue()
    {
        $option = new ProfileOption();
        $options = $this->getMock('Predis\Configuration\OptionsInterface');

        $options->expects($this->once())
                ->method('__isset')
                ->with('prefix')
                ->will($this->returnValue(true));
        $options->expects($this->once())
                ->method('__get')
                ->with('prefix')
                ->will($this->returnValue(new KeyPrefixProcessor('prefix:')));

        $profile = $option->filter($options, '2.0');

        $this->assertInstanceOf('Predis\Profile\ServerProfileInterface', $profile);
        $this->assertInstanceOf(get_class(ServerProfile::get('2.0')), $profile);

        $this->assertInstanceOf('Predis\Command\Processor\KeyPrefixProcessor', $profile->getProcessor());
        $this->assertSame('prefix:', $profile->getProcessor()->getPrefix());
    }

    /**
     * @group disconnected
     */
    public function testDoesNotApplyPrefixOnServerProfileValue()
    {
        $option = new ProfileOption();
        $options = $this->getMock('Predis\Configuration\OptionsInterface');
        $value = ServerProfile::getDefault();

        $options->expects($this->never())->method('__isset');
        $options->expects($this->never())->method('__get');

        $profile = $option->filter($options, $value);

        $this->assertInstanceOf('Predis\Profile\ServerProfileInterface', $profile);
        $this->assertInstanceOf(get_class(ServerProfile::getDefault()), $profile);
        $this->assertNull($profile->getProcessor());
    }

    /**
     * @group disconnected
     * @expectedException InvalidArgumentException
     */
    public function testThrowsExceptionOnInvalidValue()
    {
        $option = new ProfileOption();
        $options = $this->getMock('Predis\Configuration\OptionsInterface');

        $option->filter($options, new stdClass);
    }

    /**
     * @group disconnected
     * @expectedException Predis\ClientException
     */
    public function testThrowsExceptionOnUnrecognizedVersionString()
    {
        $option = new ProfileOption();
        $options = $this->getMock('Predis\Configuration\OptionsInterface');

        $option->filter($options, '0.0');
    }
}
