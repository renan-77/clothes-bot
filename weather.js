//Requiring libraries/additional files.
const fetch = require('node-fetch');
const pm = require('./process-message');

//Retrieving enviroment variables.
    const { OPENWEATHER_API_KEY } = process.env;

    //Calling api and returning temp in celsius.
    const getWeatherInfo = city =>
      fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}`
      )
        .then(response => response.json())
        .then(data => {
          const kelvin = data.main.temp;
          const celsius = Math.round(kelvin - 273.15);
          return celsius;
        })
        .catch(error =>  console.log(error));

    module.exports = getWeatherInfo;