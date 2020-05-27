//Requiring libraries
require('dotenv').config({ path: 'variables.env' });
    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const processMessage = require('./process-message');

    //Creating starting express server.
    const app = express();

    //Using parsing and cors.
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //Post for /chat.
    app.post('/chat', (req, res) => {
      const { message } = req.body;
      processMessage(message);
    });

    //Setting server port.
    app.set('port', process.env.PORT || 5000);
    const server = app.listen(app.get('port'), () => {
      console.log(`Express running → PORT ${server.address().port}`);
    });