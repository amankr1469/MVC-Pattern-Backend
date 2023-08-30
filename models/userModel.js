const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');       //Build-in module

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: [true, "Please provide a name"],
        maxLenght: [30,"Name cannot exceed 30 characters"],
        minLenght: [4,"Name cannot be less than 4"]
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: [8, 'Password must be atleast 8 characters long'],
        select: false, //find method wouldn't give us password when called as we don't want to display the password 
    },
    avatar: {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role: {
        type: String,
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordexpire: Date,
});

//Its like event that will happen when user is 'saved'
userSchema.pre("save", async function(next){             //Can't use this in arrow functions.
    
    if(!this.isModified("password")){                    //Check if the password has changed then only hash the password
        next();                                          //Otherwise it will hash the saved hashed password if other field is changed.
    }

    this.password = await bcrypt.hash(this.password, 10) //10 is strenght of hash algorithm(recommended), it consumes power.
})

//Method to generate JWT token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRE,
    })
}

//Method to Compare password from database to check if it's correct
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

//Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function(){

    //Generating Password Reset Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
       .createHash("sha256")
       .update(resetToken)
       .digest("hex");

    this.resetPasswordexpire = Date.now() + 15 * 60 * 1000; 
    
    return resetToken;
}


module.exports = mongoose.model('User', userSchema)