import Stripe from "stripe";
import express from "express"
import Order from "../models/Order.model.js";

const stripeRouter = express.Router()

const stripe = new Stripe(process.env.STRIPE_KEY)

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

stripeRouter.post(
  "/",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        console.log("err", err.message)
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    //Handle event
    if(event.type === 'checkout.session.completed'){
        //update the other
        const session = event.data.object;
        const {orderId} = session.metadata;
        const paymentStatus = session.payment_status;
        const paymentMethod = session.payment_method_types[0]
        const totalAmount = session.amount_total;
        const currency = session.currency;
        const order = await Order.findByIdAndUpdate(JSON.parse(orderId), {
            totalPrice: totalAmount / 100,
            currency, paymentMethod, paymentStatus
        }, {new:true});
        
    }else{
        return
    }

    // Return a 200 response to acknowledge receipt of the event
    return response.send();
  }
);


export default stripeRouter;
