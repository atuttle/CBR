/**
 * Codebass Radio Plugin
 *
 * @author		Adam Tuttle
 * @website		http://fusiongrokker.com
 * @copyright	Adam Tuttle 2012
 */
var sys = require('util');
var http = require('http');

Plugin = exports.Plugin = function(irc) {
	this.name = 'cbr';
	this.title = 'CBR Bot';
	this.version = '0.1';
	this.author = 'Adam Tuttle';

	this.irc = irc;

	this.irc.addTrigger(this, 'cbrstats', this.cbrstats);
	this.irc.addTrigger(this, 'commands', this.commands);
	this.irc.addTrigger(this, 'roll', this.roll);
	this.irc.addTrigger(this, '8ball', this.eightball);

	// this.init();
};

Plugin.prototype.init = function(){
	// check cbr stream title once a minute for changes
	// this.getStreamTitle(function(title){
	// 	this.streamTitle = title;
	// });

	// this.streamTitle = 'default value';
	// this.irc.send( 'FSM', 'Stream Title watch initialized. Current value: ' + this.streamTitle );

	// var that = this;
	// this.streamChecker = setInterval(getStreamTitle(function(t){
	// 	if (t !== that.streamTitle){
	// 		that.streamTitle = t;
	// 		that.irc.send( '#FSM', 'CBR Stream Title Update! New Title: ' + t );
	// 	}
	// }), 1000 * 60 * 1);
}

// Plugin.prototype.getStreamTitle = function(callback){
// 	var opts = {
// 		host: 'codebassradio.net'
// 		,path: '/cbradio/shoutcast_info.php'
// 	};
// 	var req = http.get(opts, function(response){
// 		var document = '';
// 		response.on('data', function(chunk){
// 			document += chunk;
// 		});
// 		response.on('end', function(){
// 			var data = JSON.parse(document);
// 			callback(data.serverTitle);
// 		});
// 	});

// }

Plugin.prototype.commands = function(msg){
	var irc = this.irc, // irc object
		c = msg.arguments[0], // channel
		chan = irc.channels[c], // channel object
		u = irc.user(msg.prefix), // user
		m = msg.arguments[1], // message
		params = m.split(' '),
		to = chan && chan.name || u; //canonicalized response location

	irc.send( to, ".commands, .cbrstats, .roll" );
}

Plugin.prototype.roll = function(msg){
	var irc = this.irc, // irc object
		c = msg.arguments[0], // channel
		chan = irc.channels[c], // channel object
		u = irc.user(msg.prefix), // user
		m = msg.arguments[1], // message
		params = m.split(' '),
		to = chan && chan.name || u; //canonicalized response location

	var max = 21, min = 1;

	if (params[1]){
		var limits = params[1].split(',');
		min = parseInt( limits[0] );
		max = parseInt( limits[1] ) + 1;
	}

	var roll = Math.floor( Math.random() * (max - min) + min );
	var response = ': you rolled a ' + roll;
	response += (roll === (max-1)) ? ' ~ CRIT!' : '';

	irc.send( to, u + response );
}

Plugin.prototype.cbrstats = function(msg){
	var irc = this.irc, // irc object
		c = msg.arguments[0], // channel
		chan = irc.channels[c], // channel object
		u = irc.user(msg.prefix), // user
		m = msg.arguments[1], // message
		params = m.split(' '),
		to = chan && chan.name || u; //canonicalized response location

	var opts = {
		host: 'codebassradio.net'
		,path: '/cbradio/shoutcast_info.php'
	};
	var req = http.get(opts, function(response){
		var document = '';
		// irc.send( to, 'status code: ' + response.statusCode );
		response.on('data', function(chunk){
			document += chunk;
		});
		response.on('end', function(){
			var data = JSON.parse(document);
			irc.send( to, 'Currently ' + data.listenerCount + ' people listening to ' + data.songTitle + ' ~~ http://cbrtune.in' );
		});
	});

	req.on('error', function(e){
		irc.send( to, 'error: ' + e );
	});

	req.end();
}

Plugin.prototype.eightball = function(msg){
	var irc = this.irc, // irc object
		c = msg.arguments[0], // channel
		chan = irc.channels[c], // channel object
		u = irc.user(msg.prefix), // user
		m = msg.arguments[1], // message
		params = m.split(' '),
		to = chan && chan.name || u;

	msgs = [
		"It is certain"
		,"It is decidedly so"
		,"Without a doubt"
		,"Yes – definitely"
		,"You may rely on it"
		,"As I see it, yes"
		,"Most likely"
		,"Outlook good"
		,"Yes"
		,"Signs point to yes"
		,"Reply hazy, try again"
		,"Ask again later"
		,"Better not tell you now"
		,"Cannot predict now"
		,"Concentrate and ask again"
		,"Don't count on it"
		,"My reply is no"
		,"My sources say no"
		,"Outlook not so good"
		,"Very doubtful"
	];

	irc.send( to , u + ': ' + msgs.rand() );
}

Array.prototype.rand = (function(){
	return function(){
		return this[Math.floor(Math.random()*this.length)];
	}
})();
