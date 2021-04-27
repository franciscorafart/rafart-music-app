const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AWS = require('aws-sdk');

const isProduction = process.env.NODE_ENV === 'production';
const stripeKey = isProduction? process.env.LIVE_STRIPE_SECRET_KEY: process.env.TEST_STRIPE_SECRET_KEY;

const app = express();
const path = require('path');

// Secure Cors
const origin = {
  origin: isProduction ? 'https://www.heroku.com/' : '*',
}
app.use(cors(origin));

// serves the built version of your react app
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Runing on port ${port}`);
});

// TODO: Implement endpoint to get audio files from S3