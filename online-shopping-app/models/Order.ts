import mongoose, {Model ,Schema} from 'mongoose';
import {IOrder} from "./IOrder";

const orderSchema:Schema = new mongoose.Schema({
    name : {type : String , required : true},
    email : {type : String , required : true},
    mobile : {type : String , required : true},
    tax : {type : Number , required : true},
    total : {type : Number , required : true},
    items : [
        {
            name : {type : String , required : true},
            brand : {type : String , required : true},
            price : {type : Number , required : true},
            qty : {type : Number , required : true}
        }
    ]
}, {timestamps :true});


const OrderTable:Model<IOrder> = mongoose.model('order', orderSchema);
export default OrderTable;