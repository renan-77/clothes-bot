const Dialogflow = require('dialogflow');
const Pusher = require('pusher');
const getWeatherInfo = require('./weather');
const hotTemp = 25;
const coldTemp = 15;

    // You can find your project ID in your Dialogflow agent settings
    const projectId = 'chatbot-juvywa'; //https://dialogflow.com/docs/agents#settings
    const sessionId = '123456';
    const languageCode = 'en-US';

    //Configuring credentials.
    const config = {
      credentials: {
        private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
        client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
      },
    };

    //Configuring pusher credentials.
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_APP_KEY,
      secret: process.env.PUSHER_APP_SECRET,
      cluster: process.env.PUSHER_APP_CLUSTER,
      encrypted: true,
    });

    //Creating session.
    const sessionClient = new Dialogflow.SessionsClient(config);

    //Creating session path.
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    //Processing message.
    const processMessage = message => {
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode,
          },
        },
      };

      //Detecting from dialogflow.
      sessionClient
        .detectIntent(request)
        .then(responses => {
          const result = responses[0].queryResult;

           // If the intent matches 'detect-city'
           if (result.intent.displayName === 'weather') {
            const city = result.parameters.fields['cityName'].stringValue;

            // fetch the temperature from openweather map
            return getWeatherInfo(city).then(temperature => {
              //If's to determine if it is cold/hot/mild and giving clothes based on it.
                if(temperature >= hotTemp){
                    return pusher.trigger('bot', 'bot-response', {
                        message: `The weather in ${city} is ${temperature}°C, you can wear summing clothes :)`,
                    });
                }else if(temperature <= coldTemp){
                    return pusher.trigger('bot', 'bot-response', {
                        message: `The weather in ${city} is ${temperature}°C, you better wear a coat :(`,
                    });
                }else if(temperature > coldTemp && temperature < hotTemp){
                    return pusher.trigger('bot', 'bot-response', {
                        message: `The weather in ${city} is ${temperature}°C, it's mild, wear a shirt and go for a walk :)`,
                    });
                }
              
            });
          }

          //Pushing response.
          return pusher.trigger('bot', 'bot-response', {
            message: result.fulfillmentText,
          });
        })
        .catch(err => {
          console.error('ERROR:', err);
        });
    }

    module.exports = processMessage;