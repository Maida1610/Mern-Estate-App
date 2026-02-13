import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        default: "https://lirp.cdn-website.com/f8a58d87/dms3rep/multi/opt/Headshot+placeholder+Motion+Mortgages-1920w.jpg ",
    },
}, {timestamps: true});

const User = mongoose.model("User", userSchema) ;

export default User;