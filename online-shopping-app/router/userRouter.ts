import express from 'express';
const userRouter:express.Router = express.Router();
import UserTable from '../models/User';
import {IAddress, IUser} from "../models/IUser";
import bcrypt from 'bcryptjs';
import gravar from 'gravatar';
import jwt from 'jsonwebtoken';
import {body , validationResult} from 'express-validator';
import verifyToken from "../middlewares/TokenVerifier";

/*
    @info : Register a User
    @url : http://127.0.0.1:5000/api/users/register
    @method : post
    @fields : name , email , password
    @access ; public
 */
userRouter.post('/register', [
    body('name').not().isEmpty().withMessage('Name is Required'),
    body('email').not().isEmpty().withMessage('Email is Required'),
    body('password').not().isEmpty().withMessage('Password is Required'),
] , async (request:express.Request , response:express.Response) => {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    try {
        let {name , email , password} = request.body;
        // check if user already exists
        let user:IUser = await UserTable.findOne({email : email});
        if(user){
            return response.status(401).json({errors : [{msg : 'User already Exists'}]});
        }
        // encrypt password
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        // avatar url for email
        let avatar = gravar.url(email, {
            s : '200',
            r : 'pg',
            d : 'mm'
        });

        // default address
        let address:IAddress = {
            flat : '',
            street : '',
            landmark : '',
            city : '',
            state : '',
            country : '',
            pin : '',
            mobile : ''
        };

        // register
        let newUser = new UserTable({
            name ,
            email ,
            password : hashedPassword ,
            avatar,
            address
        });
        newUser = await newUser.save();
        response.status(200).json({
            msg : 'Registration is Success'
        });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [
                {msg : error.message}
        ]});
    }
});

/*
    @info : Login a User
    @url : http://127.0.0.1:5000/api/users/login
    @method : post
    @fields : email , password
    @access ; public
 */
userRouter.post('/login', [
    body('email').not().isEmpty().withMessage('Email is Required'),
    body('password').not().isEmpty().withMessage('Password is Required'),
] ,async (request : express.Request , response : express.Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        let {email , password} = request.body;
        let user:IUser = await UserTable.findOne({email : email});
        if(!user){
            return response.status(401).json({errors : [{msg : 'Invalid Credentials'}]});
        }
        // check the password
        let isMatch:boolean = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return response.status(401).json({errors : [{msg : 'Invalid Credentials'}]});
        }
        // create a token
        let payload = {
            user : {
                id : user.id,
                name : user.name
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET_KEY,(err , token) => {
            if(err) throw err;
            response.status(200).json({
                msg : 'Login is Success',
                token : token
            });
        });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [
                {msg : error.message}
            ]});
    }
});

/*
    @info : Get User Info
    @url : http://127.0.0.1:5000/api/users/
    @method : get
    @fields : no-fields
    @access : Private
 */
userRouter.get('/', verifyToken ,async (request:express.Request , response:express.Response) => {
    try {
        let requestUser:any = request.headers['user'];
        let user:IUser = await UserTable.findById(requestUser.id).select('-password');
        response.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [
                {msg : error.message}
            ]});
    }
});

/*
    @info : Update / Create Address
    @url : http://127.0.0.1:5000/api/users/address
    @method : post
    @fields : flat , street , landmark , city , state , country , pin , mobile
    @access : Private
 */
userRouter.post('/address',[
    body('flat').not().isEmpty().withMessage('Flat is Required'),
    body('street').not().isEmpty().withMessage('Street is Required'),
    body('landmark').not().isEmpty().withMessage('Landmark is Required'),
    body('city').not().isEmpty().withMessage('City is Required'),
    body('state').not().isEmpty().withMessage('State is Required'),
    body('country').not().isEmpty().withMessage('Country is Required'),
    body('pin').not().isEmpty().withMessage('Pin is Required'),
    body('mobile').not().isEmpty().withMessage('Mobile is Required'),
], verifyToken, async (request : express.Request , response : express.Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    try {
        let {flat,street , landmark , city , state , country , pin , mobile} = request.body;

        let newAddress : IAddress = {
            flat : flat,
            street : street,
            landmark : landmark,
            city : city,
            state : state,
            country : country,
            pin : pin,
            mobile : mobile
        };
        let requestUser:any = request.headers['user']; // see verifyToken Logic
        let user:IUser = await UserTable.findById(requestUser.id);
        user.address = newAddress;
        await user.save(); // update to database
        response.status(200).json({msg : 'Address is updated'})
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [
                {msg : error.message}
            ]});
    }
});

export default userRouter;