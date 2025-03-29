import mongoose from "mongoose";

// the user model is created in models / user_models file and there are 

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },

},{timestamps:true});

const User= mongoose.model("User",userSchema);
export  default User;