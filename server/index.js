require('dotenv').config();

const express = require('express');
const cors = require('cors');
const {S3Client, GetObjectCommand} = require('@aws-sdk/client-s3')
const {
  getSignedUrl,
} = require("@aws-sdk/s3-request-presigner");

const client = new S3Client({ 
  accessKeyId: process.env.IAM_ACCESS_ID,
  secretAccessKey: process.env.IAM_SECRET,
  region: process.env.AWS_REGION,
}); // NOTE: accessKeyId and secretAccessKeu needed on express, with Lambda use only Role

const isProduction = process.env.NODE_ENV === 'production';
const stripeKey = isProduction? process.env.LIVE_STRIPE_SECRET_KEY: process.env.TEST_STRIPE_SECRET_KEY;

const stripe = require('stripe')(stripeKey);

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Secure Cors
const origin = {
  origin: isProduction ? 'https://www.heroku.com/' : '*',
}
app.use(cors(origin));

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Runing on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});
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

// Send file links from s3 to front end
app.post('/get_files', async (_, res) => {
  const files = [
    ['Synth', 'synth.mp3', 'synth', 0],
    ['Stick', 'stick.mp3', 'stick', 0],
    ['Drums', 'drums.mp3', 'drums', 0],
    ['Vox', 'vox.mp3', 'vox', 0],
    ['Guitars', 'guitar.mp3', 'guitar', 0],
  ];

  const response = [];
  let video_url;
  try {
    for (const file of files) {
      const instrumentName = file[0];
      const filename = file[1];
      const instrumentKey = file[2];
      const start = file[3];
      const url = await retrieveFileUrlS3(filename, 86400);

      response.push({
        key: instrumentKey,
        name: instrumentName,
        url: url,
        start: start,
      })
    }
    video_url = await retrieveFileUrlS3('AlienationDanceExperienceShort.mp4', 86400);
  } catch (e) {
    res.status(400).send(`There was an error on S3: ${e}`);
    return;
  }

  res.json({instruments: response, video: video_url})
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

const retrieveFileUrlS3 = async (filename, expiry) => {

  const getParams = {
    Bucket: process.env.BUCKET,
    Key: filename,
    Expires: expiry || 60, // seconds
  };
  
  const command = new GetObjectCommand(getParams);
  const res = await getSignedUrl(client, command, { expiresIn: 3600 })
  
  return res
}