var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');
var fetch = require('node-fetch');

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
        //console.log(args)
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
            //!gamble
            case 'gamble':
                // if there is no amount that the user wanted to gamble
                if (args.length == 0) {
                  bot.sendMessage({
                    to: channelID,
                    message: " ``` To use !gamble please add the amount of pennies you would like to gamble! (i.e. !gamble 100) ``` "
                  })
                }
                // makes it so that you either have to have more than 100 pennies to gamble or
                // have more pennies than you want to gamble
                if ((args[0] > userData[userID].pennies) || (userData[userID].pennies < 100)) {
                    bot.sendMessage({
                      to: channelID,
                      message: " ```You do not have enough pennies to gamble that much! ``` "
                    })
                }
                // short cut if you want to gamble all that you have
                if (args[0] == 'all') {
                    //lose
                    if (Math.random() >= 0.5) {
                        userData[userID].pennies -= userData[userID].pennies
                        bot.sendMessage({
                            to: channelID,
                            message: user + ' has lost all of their pennies! :('
                        })
                    }
                    //win
                    else {
                        userData[userID].pennies += userData[userID].pennies
                        bot.sendMessage({
                            to: channelID,
                            message: user + ' doubled thier pennies! :)'
                        })
                    }
                }
                //case where you want to gamble a certain amount
                else {
                    //lose
                    if (Math.random() >= 0.5) {
                        userData[userID].pennies -= parseInt(args[0])
                        bot.sendMessage({
                            to: channelID,
                            message: user + ' has lost ' + args[0] + ' pennies! :('
                        })
                    }
                    //win
                    else {
                        userData[userID].pennies += parseInt(args[0])
                        bot.sendMessage({
                            to: channelID,
                            message: user + ' has won ' + args[0] + ' pennies! :)'
                        })
                    }
                }
            break;

            case 'google':
                if (args.length == 0){
                    bot.sendMessage({
                        to: channelID,
                        message: "Please put what you want to google after the command! \n ```i.e. !google Spongebob Squarepants```"
                    })
                    break;
                }
                if (args[0] == "please"){
                  var parseString = ""
                  var apiURL = "https://serpapi.com/search?q"
                  var finalLink = ''
                  for(var i = 1 ; i < args.length ; i++){
                    if(i == args.length-1){
                      parseString += args[i].toString()
                    }else{
                      parseString += args[i].toString() + "+"
                    }
                  }
                  bot.sendMessage({
                    to: channelID,
                    message: "https://www.google.com/search?q="+parseString
                  });
                }
                else{
                  var parseString = ""
                  for(var i = 0 ; i < args.length ; i++){
                    if(i == args.length-1){
                      parseString += args[i].toString()
                    }else{
                      parseString += args[i].toString() + "+"
                    }
                  }
                  bot.sendMessage({
                    to: channelID,
                    message: 'http://lmgtfy.com/?q='+parseString
                  })
                }
            break;
            //!help
            case 'help':
                bot.sendMessage({
                    to:channelID,
                    message: " ``` Krab Borg supports these operations: \n !beep \n !boop \n !pennies \n !treasure \n !gamble ``` "
                })
            break;
         }
     }
});
