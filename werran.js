var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');

var dataWords;
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    fs.readFile('DATA', 'utf8', function(err, contents) {
	dataWords = contents.toString().split("\n");
	//console.log(dataWords);	
	
    });
});


function joinChannelOfSender(bot, userId) {
    var voiceChannelId  = findVoiceChannelOfUser(bot, userId);
    bot.joinVoiceChannel(voiceChannelId);
}
function findVoiceChannelOfUser(bot, userId) {
  channels = bot.channels;
  for(var channelId in channels) {
	channel = channels[channelId];
	members = channel.members;
        for(var memberId in members) {
		//console.log("hello member: " + memberId);
		if(userId == memberId) {
			console.log(userId + " is in channel " + channel.id);
			return channel.id;
		}
	}
  }
  return -1337;
}

bot.on('message', function (user, userID, channelID, message, evt) {
    //console.log("message");
    //console.log(bot.channels);
    joinChannelOfSender(bot, userID);
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
		break;
	    case 'prediction':
		var index = Math.floor(Math.random() * dataWords.length);
		sendMsg(bot, dataWords[index], channelID);
		break;
	    case 'active':
		activateTalk(bot, channelID);
		break;
	    case 'voice':
		voicePls(bot, userID);
	    break;
            // Just add any case commands if you want to..
         }
     }
});

function voicePls(bot, userId) {
	file = "test.mp3";
	id = findVoiceChannelOfUser(userId);
	 
	id = "386464621839515649";
	bot.getAudioContext(id, function(err, stream) {
		if(err) {
			console.log("error");
		}
		console.log("hello " + id);
			
		playing = fs.createReadStream(file);
		//console.log(playing);
		
		playing.pipe(stream, {end: false});
		if(err) {
			console.log("errror in pipe: " + err);
		}
		stream.on("done", function () {
	
		});
		

	});
}

function sendMsg(bot, msg, channelID) {
	bot.sendMessage({
		to: channelID,
		message: msg
	});
}


var intervalOne = 0;
var insecureInterval = 0;
function activateTalk(bot, channelID) {
	if(intervalOne == 0) {
		
		sendMsg(bot, "csgo?", channelID);
		intervalOne = setInterval(function() {
		var index = Math.floor(Math.random() * dataWords.length);
		msg = dataWords[index];
		sendMsg(bot, msg, channelID);
		}, 1000*60*5);
	}else {
		sendMsg(bot, "brb, ska dra o köpa glass", channelID);
		clearInterval(intervalOne);
		intervalOne = 0;
	}	

	if(insecureInterval == 0) {
		//varje 30 mins
		var insecureMsgs = ["nån här?", "hallå?", "games?", "town?", "csgo?"];	
		insecureInterval = setInterval(function() {
		var index = Math.floor(Math.random() * insecureMsgs.length)
		msg = insecureMsgs[index];
		sendMsg(bot,msg,channelID);
		}, 1000*60*30);
	}	

}



