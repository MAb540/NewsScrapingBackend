import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({

    name:{
        type:String,
        trim:true,
        required:true,
        max:64
    },

    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        lowercase:true
    },

    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false,
    }

},{
    timestamps:true
})

const User = mongoose.model("User",UserSchema);

export default User;