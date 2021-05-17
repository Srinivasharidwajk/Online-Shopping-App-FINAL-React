import mongoose , {Model, Schema} from 'mongoose';
import {IUser} from "./IUser";

const userSchema:Schema = new mongoose.Schema({
    name : {type : String , required : true},
    email : {type : String , required : true , unique : true},
    password : {type : String , required : true},
    avatar : {type : String , required : true},
    isAdmin : {type : Boolean , default : false},
    address : {
        flat : {type : String },
        street : {type : String },
        landmark : {type : String },
        city : {type : String },
        state : {type : String },
        country : {type : String },
        pin : {type : String },
        mobile : {type : String }
    },
}, {timestamps : true});

const UserTable:Model<IUser> = mongoose.model('user', userSchema);
export default UserTable;