var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');

//Configure JSON for users
var userData = JSON.parse(fs.readFileSync('./database/userData.json','utf8'));

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
    //Checking if user is in userData.json
    if (!userData[userID]) userData[userID] = {
        messagesSent: 0
    }
    //increase user messages sent by 1
    userData[userID].messagesSent++;

    fs.writeFile('./database/userData.json', JSON.stringify(userData), (err) => {
      if (err) console.error(err)
    })

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
            break;
            //!boop
            case 'boop':
                bot.sendMessage({
                    to: channelID,
                    message: 'https://www.youtube.com/watch?v=lUAUdG8QhSc'
                })
            break;
            //!pennies
            case 'pennies':
                if (!userData[userID].pennies) userData[userID].pennies = 0
                var numPennies = userData[userID].pennies;
                bot.sendMessage({
                    to: channelID,
                    message: user + ' has ' + numPennies + ' pennies!'
                })
            break;
            //!treasure
            case 'treasure':
                if (!userData[userID].pennies) userData[userID].pennies = 0
                var treasure = Math.floor(Math.random() * 10);
                userData[userID].pennies += treasure
                bot.sendMessage({
                    to: channelID,
                    message: user + ' has found ' + treasure + ' pennies!'
                })
            break;
            //!help
            case 'help':
                bot.sendMessage({
                    to:channelID,
                    message: " ``` Krab Borg supports these operations: \n !beep \n !boop \n !pennies \n !treasure``` "
                })
            break;
         }
     }
});
