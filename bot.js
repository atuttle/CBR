/**
 * IRC Bot
 *
 * @author		Michael Owens
 * @website		http://www.michaelowens.nl
 * @copyright	Michael Owens 2011
 */
var sys = require('util'),
	irc = require('./irc/irc');

/**
 * Config
 */
var config = {
	host:		'irc.freenode.net',
	port:		6667,
	nick:		'CBR',
	username:	'CodeBassRadio',
	realname:	'CodeBass Where Geek And Music Combine',
	channels:	['#CBR', '#codebass'],
	command:	'.',
	debug:		false,

	plugins:	['global', 'reload', 'cbr']
};

/**
 * Let's power up
 */
var ircClient = new irc.Server(config);
ircClient.connect();