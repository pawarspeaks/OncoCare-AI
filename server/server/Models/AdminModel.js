import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    verified_otp_time:{
        type:Number,
        required:true
    }
})
AdminSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
})

const Admin = mongoose.model('Admin', AdminSchema, 'admins'); // 'admins' is the collection name

export default Admin;