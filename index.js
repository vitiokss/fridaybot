const Botkit = require('botkit');
const moment = require('moment');
const bad = require('./bad-words');

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

// listen for direct message
slack.on('direct_mention', (bot, message) => {
  let text = "";
  switch (moment().day()) {
    case 6:
    case 0:
      text = "It’s time to enjoy the weekend, I wish you lots of fun and that you have a super time.";
      break;
    case 1:
      text = "Start a new week, you are unstoppable, invincible and powerful today! Drink coffe and be patient 4 days left till Friday! :coffee:"
      break;
    case 2:
      text = "Monday is over! You have survived. 3 days left to Friday! :unamused:"
      break;
    case 3:
      text = "Fish day! :fish: Drink more coffe, 2 days left to awesome Friday! :tired_face:"
      break;
    case 4:
      text = "Little friday is here! Survive 1 more day till Friday! :pray:"
      break;
    case 5:
      text = "Ouu yes! It's finally Friday! Don't forget to drink some beers! :tada: :beers:"
      break;
    default:
  }
  bot.reply(message, text);
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
