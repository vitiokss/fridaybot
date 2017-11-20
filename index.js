const Botkit = require('botkit');
const moment = require('moment');

// init slack bot
const slack = Botkit.slackbot({
  token: process.env.FRIDAY_BOT_TOKEN,
  scopes: ['bot'],
});

// listen for direct message
slack.on('direct_mention', function(bot, message) {
  const isFriday = moment().day() == 5
  bot.reply(message, isFriday ? 'YES': 'NO');
});
