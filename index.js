//import { config } from './config'
const { Autohook } = require('twitter-autohook');

(async start => {
  try {
    const webhook = new Autohook();

    // listen for mentions
    webhook.on('event', async event => {
        if (event.tweet_create_events) {
          await didMention(event); // callback function when event triggers
        }
      });


    // Removes existing webhooks
    await webhook.removeWebhooks();
    
    // Starts a server and adds a new webhook
    await webhook.start();
    
    // Subscribes to your own user's activity
    await webhook.subscribe({oauth_token: process.env.TWITTER_ACCESS_TOKEN, oauth_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET});  
  } catch (e) {
    // Display the error and quit
    console.error(e);
    process.exit(1);
  }
})(); 

// callback function when event triggers
async function didMention(event) {
    // save sender information (the person who mentioned me) into an object
    let senderInfo = {
        senderId: undefined,
        senderScreenName: '',
        senderText: '',
        senderLocation: ''
    }

    senderInfo.senderId = event.tweet_create_events[0].user.id;
    senderInfo.text = event.tweet_create_events[0].text;
    senderInfo.senderLocation = event.tweet_create_events[0].user.location;
    senderInfo.senderScreenName = event.tweet_create_events[0].user.screen_name;

    // construct the message to tweet on my feed
    const statusMessageToSend = "Hello, @" + senderInfo.senderScreenName + ". You are in " + senderInfo.senderLocation;

    // use the Twit object to handle posting
    let Twit = require('twit');

    let T = new Twit({
        consumer_key:         'LY66zhOzv53aZm7lBRibx94ns',
        consumer_secret:      'FeHT3PY24nURlBMrU3QzWYRGOpVQ1mTfxJqle7duua559CaChq',
        access_token:         '1105793491576090624-zYNN9Vy0O1fDaS9U5XccQWAqhuZKi1',
        access_token_secret:  'P35onKoDXfEfZ1jJQgBv5wJTrWhkXDZ7mlvtebWoK2OSA',
    });

    T.post('statuses/update', { status: statusMessageToSend }, function(err, data, response) {
        console.log(data)
    })

    // debugging purposes:

    // console.log(event); 
    // console.log("You sent me: " + senderInfo.text);
    // console.log("You are located in: " + senderInfo.location);
};

// TO DO:

// Develop logic to check for location
// Investigate why it is also retweeting my own