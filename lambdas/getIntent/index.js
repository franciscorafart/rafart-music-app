const isProduction = process.env.NODE_ENV === 'production';
const stripeKey = isProduction? process.env.LIVE_STRIPE_SECRET_KEY: process.env.TEST_STRIPE_SECRET_KEY;

const stripe = require('stripe')(stripeKey);
const headers = {
    "Access-Control-Allow-Headers" : "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
}


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

export const handler = async (event) => {
    console.log('event.body', event.body)
    try {
        const payload = event.body;
        const { amount, currency, paymentMethodId, customerEmail } = payload;
        
        const data = await getStripeIntent(amount, currency, paymentMethodId, customerEmail)
        const state = { clientSecret: data.client_secret}

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(state),
          };
    } catch (e) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify(`There was an error on S3: ${e}`),
          }
    }
}