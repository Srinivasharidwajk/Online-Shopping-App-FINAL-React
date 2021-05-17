import express from 'express';
const productRouter:express.Router = express.Router();
import verifyToken from "../middlewares/TokenVerifier";
import {body , validationResult} from 'express-validator';
import ProductTable from "../models/Product";
import {IProduct} from "../models/IProduct";
import {} from 'mongoose';

/*
    @info : Upload a Product
    @url : http://127.0.0.1:5000/api/products/upload
    @method : post
    @fields : name , brand , price , qty , image , category , description , usage
    @access ; private
 */
productRouter.post('/upload', [
    body('name').not().isEmpty().withMessage('Name is Required'),
    body('brand').not().isEmpty().withMessage('Brand is Required'),
    body('price').not().isEmpty().withMessage('Price is Required'),
    body('qty').not().isEmpty().withMessage('Qty is Required'),
    body('image').not().isEmpty().withMessage('Image is Required'),
    body('category').not().isEmpty().withMessage('Category is Required'),
    body('description').not().isEmpty().withMessage('Description is Required'),
    body('usage').not().isEmpty().withMessage('Usage is Required'),
] , verifyToken, async (request:express.Request , response:express.Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        let {name , brand , price , qty , image , category , description , usage} = request.body;
        let product:IProduct = new ProductTable({name , brand , price , qty , image , category , description , usage});
        await product.save();
        response.status(200).json({msg : 'Product is Uploaded Successfully'})
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [
                {msg : error.message}
            ]});
    }
});

/*
    @info : Get Men's Collection
    @url : http://127.0.0.1:5000/api/products/men
    @method : get
    @fields : no-fields
    @access : public
 */
productRouter.get('/men', async (request : express.Request , response: express.Response) => {
    try {
        let products:Array<IProduct> = await ProductTable.find({category : 'MEN'});
        response.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [
                {msg : error.message}
            ]});
    }
});

/*
    @info : Get Women's Collection
    @url : http://127.0.0.1:5000/api/products/women
    @method : get
    @fields : no-fields
    @access : public
 */
productRouter.get('/women', async (request : express.Request , response: express.Response) => {
    try {
        let products:Array<IProduct> = await ProductTable.find({category : 'WOMEN'});
        response.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [
                {msg : error.message}
            ]});
    }
});

/*
    @info : Get Kids's Collection
    @url : http://127.0.0.1:5000/api/products/kids
    @method : get
    @fields : no-fields
    @access : public
 */
productRouter.get('/kids', async (request : express.Request , response: express.Response) => {
    try {
        let products:Array<IProduct> = await ProductTable.find({category : 'KIDS'});
        response.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [
                {msg : error.message}
            ]});
    }
});

/*
    @info : Get a Product
    @url : http://127.0.0.1:5000/api/products/:productId
    @method : get
    @fields : no-fields
    @access : public
 */
productRouter.get('/:productId', async (request : express.Request , response: express.Response) => {
    try {
        let productId:string = request.params.productId;
        let product:IProduct = await ProductTable.findById(productId);
        if(!product){
            return response.status(404).json({errors : [{msg : 'No Product Found'}]});
        }
        response.status(200).json(product);
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [
                {msg : error.message}
            ]});
    }
});


export default productRouter;