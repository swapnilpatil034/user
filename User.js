const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    mobileNo : Number,
    address : String,
    email : String,
    password: String
});

userSchema.pre( "save",async function(next){
    this.password = await bcrypt.hash(password, 10)
    next();
})

module.exports = mongoose.model("users",userSchema);