// Modules
require('dotenv-extended').load();

const restify = require('restify');
const builder = require('botbuilder');
const rp = require('request-promise');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
// Listen for any activity on port 3978 of our local server

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const inMemoryStorage = new builder.MemoryBotStorage();
let bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage); // Register in memory storage

// If a Post request is made to /api/messages on port 3978 of our local server, then we pass it to the bot connector to handle
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

const luisModelUrl = 'https://' + process.env.LuisAPIHostName + '/luis/v2.0/apps/' + process.env.LUIS_appId + '?subscription-key=' + process.env.LuisAPIKey;

var luisRecognizer = new builder.LuisRecognizer(luisModelUrl);

var intentDialog = new builder.IntentDialog({recognizers: [luisRecognizer]});

//This is called the root dialog. It is the first point of entry for any message the bot receives
bot.dialog('/', intentDialog);

intentDialog.matches(/\b(hi|hello|hey|howdy)\b/i, '/sayHi')
    .matches('GetConnectedTerminals', '/getterminals')
    .onDefault(builder.DialogAction.send("Sorry, I didn't understand what you said."));

bot.dialog('/sayHi', function(session) {
    session.send('Hi there!  Welcome to Travel Info, How could I help you');
    session.endDialog();
});

bot.dialog('/getterminals', [
  function (session, results, next){
    let from_state, to_state;
    const fromState = builder.EntityRecognizer.findEntity(results.entities, 'from_state');
    const destState = builder.EntityRecognizer.findEntity(results.entities, 'dest_state');

    if ((results.entities.length === 0) && (fromState === null) && (destState === null))

      // This is executed, when the user not provided enough parameters
      session.endDialog("Please rephrase your question! ");

    else if (fromState && destState) {

      from_state = fromState.entity
      to_state = destState.entity

      //Show user that we're processing their request by sending the typing indicator
      session.sendTyping();

      // Build the url we'll be calling to get the terminal details
      var url = "https://travelinfo-api-staging.herokuapp.com/resolve/?"
                + "from_state=" + from_state + "&dest_state=" + to_state;

      // Build options for the request
      var options = {
        uri: url,
        json: true // Returns the response in json
      }

      //Make the call
      rp(options).then(function (body){
        let success = body["success"];

        // The request is successful
        if(success)
          terminalDetails(session, results, body);
        else
          session.send(body["message"]);
      }).catch(function (err){

        // An error occurred and the request failed
        console.log(err.message);
        session.send("Oops, something went wrong. :( Try again?");
      }).finally(function () {

        // This is executed at the end, regardless of whether the request is successful or not
        session.endDialog();
      });
    }
    else
    {
      // This is executed, when the user not provided enough parameters
      session.endDialog("Sorry, I didn't understand what you said. Please rephrase it :)");
    }
  }
]);

// This function processes the results from the API call
function terminalDetails(session, results, body){
  session.send(body["message"]);

  // Count the length of the response results
  resultsInfoLength = body.data.length;

  // Iterate through all response results returned by the API
  for(let i=0; i<resultsInfoLength; i++)
  {
    session.send(body["data"][i]["terminal"] + ':\n\n' + body["data"][i]["description"]);
  }
}
