import express from 'express';
import cors from 'cors';
import dotEnv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from "./router/userRouter";
import productRouter from "./router/productRouter";
import orderRouter from "./router/orderRouter";
import paymentRouter from "./router/paymentRouter";
import path from 'path';

const app:express.Application = express();

// configure cors
app.use(cors());

// configure dotEnv
dotEnv.config({path : './.env'});

const port = process.env.PORT || 5000;

// configure express to receive the form data
app.use(express.json());

// configure mongodb connection
if(process.env.MONGO_DB_CLOUD !== undefined){
    // URL changed to Cloud
    mongoose.connect(process.env.MONGO_DB_CLOUD, {
        useCreateIndex : true,
        useFindAndModify : false,
        useNewUrlParser : true,
        useUnifiedTopology : true
    }).then((response) => {
        console.log('Connected to MongoDB Successfully.......');
    }).catch((error) => {
        console.error(error);
        process.exit(1); // stop the node js process, if unable to connect to mongodb
    });
}

// Home page url for application
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname , 'client' , 'build')));
    app.get('/', (request,response) => {
        response.sendFile(path.join(__dirname , 'client' , 'build' , 'index.html'));
    });
}

// router configurations
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRouter);

// listen to port
app.listen(Number(port), () => {
    console.log(`Express Server is Started at PORT : ${port}`);
});












