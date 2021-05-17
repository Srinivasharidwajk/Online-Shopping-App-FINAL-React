import mongoose, {Model, Schema} from 'mongoose';
import {IProduct} from "./IProduct";

const productSchema:Schema = new mongoose.Schema({
    name : {type : String , required : true},
    price : {type : Number , required : true},
    brand : {type : String , required : true},
    qty : {type : Number , required : true},
    image : {type : String , required : true},
    category : {type : String , required : true},
    description : {type : String , required : true},
    usage : {type : String , required : true}
}, {timestamps : true});

const ProductTable : Model<IProduct> = mongoose.model('product', productSchema);
export default ProductTable;