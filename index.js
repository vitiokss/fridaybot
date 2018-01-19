const Botkit = require('botkit');
const _ = require('lodash');
const moment = require('moment');
const bad = require('./quotes/bad');
const quotes = require('./quotes/quotes.json');
const jokes = require('./quotes/jokes.json');
// init slack bot
const slack = Botkit.slackbot({
  retry: 'Infinity',
  debug: false,
});

slack.spawn({
  token: process.env.FRIDAY_BOT_TOKEN,
})
.startRTM((err, bot, payload) => {
  if (err) throw new Error(err);
  console.log('Friday bot is up and running...');
});

function format(message, quote) {
  var message = {
    "pretext": message,
    "text": quote.body || quote.text,
    "mrkdwn_in": ["text","pretext"]
  };
  if (quote && quote.from) {
    message.title = quote.from;
  }
  return message;
}

// listen for direct message
slack.on('direct_mention', (bot, message) => {
  let text = "";
  const joke = jokes[_.random(0, jokes.length - 1)]
  const motivation = quotes[_.random(0, quotes.length - 1)]
  switch (moment().day()) {
    case 6:
    case 0:
      bot.reply(message, format("It’s time to enjoy the weekend, I wish you lots of fun and that you have a super time.", joke));
      break;
    case 1:
      bot.reply(message, format("Start a new week, you are unstoppable, invincible and powerful today! Drink coffee and be patient 4 days left till Friday! :coffee: ", motivation)); 
      break;
    case 2:
      bot.reply(message, format("Monday is over! You have survived. 3 days left to Friday! :unamused:", motivation))
      break;
    case 3:
      bot.reply(message, format("Fish day! :fish: Drink more coffee, 2 days left to awesome Friday! :tired_face:", joke))
      break;
    case 4:
      bot.reply(message, format("Little friday is here! Survive 1 more day till Friday! :pray:", motivation));
      break;
    case 5:
      bot.reply(message, format("Ouu yes! It's finally Friday! Don't forget to drink some beers! :tada: :beers:", joke));
      break;
    default:
  }
});

// listen if someone swears on the channel
slack.hears(bad, ["direct_message", "direct_mention", "mention", "ambient"], (bot, message) => {
  bot.api.users.info({user:message.user}, (err,response) => {
    if(err) {
      bot.reply(message, `No worries... Friday is coming soon!`);
    }
    else {
      const user = response["user"];
      bot.reply(message, `No worries...<@${user["name"] || ''}> Friday is coming soon!`);
    }
  });
});
