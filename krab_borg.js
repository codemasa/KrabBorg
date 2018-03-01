var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');
var db = require('mongodb');

//Configure JSON for users
var userData = JSON.parse(fs.readFilesSync())

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
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {

            //!beep for the memes
            case 'beep':
                bot.sendMessage({
                    to: channelID,
                    message: 'boop boop bop boop boop bop' + "\n" + "https://www.youtube.com/watch?v=Z1MHfA5v3Co"
                })
            case 'boop':
                bot.sendMessage({
                    to: channelID,
                    message: 'https://www.youtube.com/watch?v=lUAUdG8QhSc'
                })

            case 'pennies':
                var numPennies = db.get(userID)
                bot.sendMessage({
                    to: channelID,
                    message: user + ' has ' + numPennies + ' pennies!'
                })
            //!help
            case 'help':
                bot.sendMessage({
                    to:channelID,
                    message: " ``` Krab Borg supports these operations: \n !beep \n !boop \n !pennies ``` "
                })
            break;
            // Just add any case commands if you want to..
         }
     }
});
