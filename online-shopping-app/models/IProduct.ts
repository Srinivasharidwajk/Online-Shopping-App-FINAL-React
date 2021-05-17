import {Document} from 'mongoose';

export interface IProduct extends Document{
    _id ? : string;
    name : string;
    price : number;
    brand : string;
    qty : number;
    image : string;
    category : string;
    description : string;
    usage : string;
    createdAt? : string;
    updatedAt? : string;
}