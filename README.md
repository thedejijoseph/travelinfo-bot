
ChatBot was built to help the traveller to know where public transport terminals are in each state. And which destination you can travel to from that terminal.
For example, ChatBot can tell you that there are X number of interstate terminals in Lagos State, and if you want to get a bus going to Kaduna, you need to go to Terminal XYZ.

We will be using the Microsoft Bot Framework NodeJS SDK to build the bot web service and utilize some NPMs and open source SDKs along with Cognitive Services APIs.

### Prerequisites 

- Install [NodeJS](https://nodejs.org/en/). After you've installed this, open your command line and run `npm install npm -g`. This updates Node's Package Manager (npm) to the latest version.
- Install [Visual Studio Code](https://code.visualstudio.com/) (or any other code editor of your choice)
- Install [Bot Framework emulator](https://emulator.botframework.com)

#### LUIS Application

The first step to using LUIS is to create or import an application. Go to the home page, www.luis.ai, and log in. After creating the LUIS account we should be able to Import an Existing Application where we need to select a local copy of the travelinfo-luis.json file to import it.

To test this application, we have to import the pre-build [travelinfo-luis.json](travelinfo-luis.json) file into the LUIS account.

Once we imported the application we need to "train" the model ([Training](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/train-test)) before we can "Publish" the model in an HTTP endpoint. For more information, take a look at [Publishing a Model](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/publishapp).

#### Application ID and Endpoint Key

We need these two values to configure the code in your application:

1. Application ID

    In the LUIS application's dashboard, you can copy the App ID from the address bar.
    
    
2. Endpoint Key

    Once your app is published, copy the endpoint key from the application resources on the Publish App page.
    
    
## Code Highlights

One of the key problems in human-computer interactions is the ability of the computer to understand what a person wants, and to find the pieces of information that are relevant to their intent. In the LUIS application, we will bundle together the intents and entities that are important to the task. Read more about [Planning an Application](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/plan-your-app) in the LUIS Help

This application has an intent: GetConnectedTerminals .It detects from_state entity and an dest_state entity.

Each intent has a handler method accepts a result from LUIS including the matching Intents and Entities for the LUIS query. 

The Bot has the LuisRecognizer that is pointed at the model and 
then passing that recognizer to an IntentDialog using theRecognizer plugins 
which detect intention from user messages. Calls the API in backend with matching entities (source and destination states) to get the terminal details based on the user intent.


### Additional reference links

To get more information about how to get started in Bot Builder and Conversations, please review the following resources:

- Microsoft Bot Framework documentation [Link](https://docs.botframework.com/en-us/)
- Full LUIS documentation [Link](https://www.luis.ai/help)
- Bot Samples for Nodejs [Link](https://github.com/Microsoft/BotBuilder/tree/master/Node/examples)
- More Bot Samples [Link](https://github.com/Microsoft/BotBuilder-Samples)
- Lots of Bot resources [Link](https://aka.ms/botresources)
