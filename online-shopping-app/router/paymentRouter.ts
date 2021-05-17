import express from 'express';
import verifyToken from "../middlewares/TokenVerifier";
import cors from 'cors';
import {v4} from 'uuid';

const paymentRouter:express.Router = express.Router();

interface PaymentBody{
    product : {
        name : string;
        amount : number;
        currency : string;
    },
    customer : {
        name : string;
        address : {
            line1: string;
            postal_code: string;
            city: string;
            state: string;
            country: string;
        }
    },
    description : string;
    email : string;
    source : string;
    stripeTokenType : string;
}


// Load Stripe Library
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/*
    @info : to make stripe payments
    @url : http://127.0.0.1:5000/api/payments/checkout
    @method : post
    @fields : body
    @access ; private
 */
paymentRouter.post('/checkout', verifyToken, cors(), async (request , response) => {
    console.log('---------------------------------------------- Checkout ---------------');
    console.log(request.body);
    console.log(request.headers);
    try {
        const paymentBody:PaymentBody = request.body;
        const customer = await stripe.customers.create({
            name : paymentBody.customer.name,
            address : {
                line1: paymentBody.customer.address.line1,
                postal_code: paymentBody.customer.address.postal_code,
                city: paymentBody.customer.address.city,
                state: paymentBody.customer.address.state,
                country: paymentBody.customer.address.country,
            },
            description : paymentBody.description,
            email: paymentBody.email,
            source: paymentBody.source
        });

        if(paymentBody.stripeTokenType === 'card'){
            const idempotencyKey = v4();
            const charge = await stripe.charges.create(
                {
                    amount : paymentBody.product.amount,
                    currency: paymentBody.product.currency,
                    customer: customer.id,
                    description: paymentBody.description,
                },
                {
                    idempotencyKey,
                }
            );
            console.log(charge);
        }
        else{
            console.error(`Unrecognized Stripe token type: "${paymentBody.stripeTokenType}"`);
        }
        response.status(200).json({msg : 'payment is success'});
    }
    catch (error) {
        console.error(error);
        response.status(200).json({errors : [{msg : error}]});
    }
});
export default paymentRouter;
