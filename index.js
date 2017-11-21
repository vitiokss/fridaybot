const Botkit = require('botkit');
const moment = require('moment');

// init slack bot
const slack = Botkit.slackbot({
  retry: 'Infinity',
  debug: false,
});

slack.spawn({
  token: process.env.FRIDAY_BOT_TOKEN,
})
.startRTM(function (err, bot, payload) {
  if (err) throw new Error(err);
  console.log('Friday bot running...');
});

// listen for direct message
slack.on('direct_mention', function(bot, message) {
  const isFriday = moment().day() == 5
  bot.reply(message, isFriday ? 'YES': 'NO');
});
