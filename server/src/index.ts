import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { retrieveFileUrlS3 } from "./helpers/s3";
import authentication from "./routes/auth";

const isProduction = process.env.NODE_ENV === "production";
const stripeKey = isProduction
  ? process.env.LIVE_STRIPE_SECRET_KEY
  : process.env.TEST_STRIPE_SECRET_KEY;

const stripe = require("stripe")(stripeKey);

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Secure Cors
const origin = {
  origin: isProduction ? "https://www.heroku.com/" : "*",
};
app.use(cors(origin));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Runing on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// Stripe payment intent
app.post("/get_intent", (req, res) => {
  const payload = req.body;
  const { amount, currency, paymentMethodId, customerEmail } = payload;

  getStripeIntent(amount, currency, paymentMethodId, customerEmail)
    .then((data) => {
      const state = { clientSecret: data.client_secret };
      const response = JSON.stringify(state);

      res.send(response);
    })
    .catch((e) => res.json(JSON.stringify({ stripe_error: e })));
});

// Send file links from s3 to front end
app.post("/get_files", async (_, res) => {
  const files = [
    ["Synth", "synth.mp3", "synth", 0],
    ["Stick", "stick.mp3", "stick", 0],
    ["Drums", "drums.mp3", "drums", 0],
    ["Vox", "vox.mp3", "vox", 0],
    ["Guitars", "guitar.mp3", "guitar", 0],
  ];

  const response = [];
  let video_url;
  try {
    for (const file of files) {
      const instrumentName = file[0];
      const filename = String(file[1]);
      const instrumentKey = file[2];
      const start = file[3];
      const url = await retrieveFileUrlS3(filename, 86400);

      response.push({
        key: instrumentKey,
        name: instrumentName,
        url: url,
        start: start,
      });
    }
    video_url = await retrieveFileUrlS3(
      "AlienationDanceExperienceShort.mp4",
      86400
    );
  } catch (e) {
    res.status(400).send(`There was an error on S3: ${e}`);
    return;
  }

  res.json({ instruments: response, video: video_url });
});

// routes
app.use("/auth", authentication);

// HELPERS

const getStripeIntent = async (
  amount: number,
  currency: string,
  paymentMethodId: string,
  customerEmail: string
) => {
  const description =
    "Rafart - Alienation Dance project support" + customerEmail;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: currency,
    payment_method_types: ["card"],
    description: description,
    receipt_email: customerEmail,
    payment_method: paymentMethodId,
    confirmation_method: "automatic",
    // confirm: true
  });

  return await paymentIntent;
};
