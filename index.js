require('dotenv').config();

const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');

const isProduction = process.env.NODE_ENV === 'production';
const stripeKey = isProduction? process.env.LIVE_STRIPE_SECRET_KEY: process.env.TEST_STRIPE_SECRET_KEY;
console.log('isProduction', isProduction)
const stripe = require('stripe')(stripeKey);

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

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

AWS.config.update({
  accessKeyId: process.env.IAM_ACCESS_ID,
  secretAccessKey: process.env.IAM_SECRET,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const port = process.env.PORT || 8000;

app.listen(port, '0.0.0.0', () => {
    console.log(`Runing on port ${port}`);
});

// ENDPOINTS

// Stripe payment intent
app.post('/get_intent', (req, res) => {
  const payload = req.body;
  const { amount, currency, paymentMethodId, customerEmail } = payload;

  getStripeIntent(amount, currency, paymentMethodId, customerEmail).then(data => {
      const state = { clientSecret: data.client_secret}
      const response = JSON.stringify(state);

      res.send(response);
  }).catch(e => res.json(JSON.stringify({"stripe_error": e})))
});

// Send audio files links from s3 to front end
app.post('/get_audio_files', (_, res) => {
  const files = [
    ['Synth', 'synth.mp3', 'synth', 0],
    ['Stick', 'stick.mp3', 'stick', 0],
    ['Drums', 'drums.mp3', 'drums', 0],
    ['Vox', 'vox.mp3', 'vox', 0],
    ['Guitars', 'guitar.mp3', 'guitar', 0],
  ];

  const response = [];

  try {
    for (const file of files) {
      const instrumentName = file[0];
      const filename = file[1];
      const instrumentKey = file[2];
      const start = file[3];
      const url = retrieveFileUrlS3(filename);

      response.push({
        key: instrumentKey,
        name: instrumentName,
        url: url,
        start: start,
      })
    }
  } catch (e) {
    res.status(400).send(`There was an error on S3: ${e}`);
  }

  res.json({instruments: response})
});

// HELPERS
const getStripeIntent = async (amount, currency, paymentMethodId, customerEmail) => {
  const description = "Rafart - Alienation Dance project support" + customerEmail

  const paymentIntent = await stripe.paymentIntents.create({
      amount: amount*100,
      currency: currency,
      payment_method_types: ['card'],
      description: description,
      receipt_email: customerEmail,
      payment_method: paymentMethodId,
      confirmation_method: 'automatic',
      // confirm: true
  });

  return await paymentIntent;
}

const retrieveFileUrlS3 = (filename) => {
  const getParams = {
      Bucket: process.env.BUCKET,
      Key: filename,
      Expires: 60, // seconds
  };

  return s3.getSignedUrl('getObject', getParams);
}