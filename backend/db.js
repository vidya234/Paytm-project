const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//connect to the database
mongoose.connect("mongodb+srv://vidya:zneTUrAc28xYNFu@cluster0.l2d0kro.mongodb.net/")

//User schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
   
    firstname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }
});

//create a model for the user schema
const User = mongoose.model('User', userSchema);

//Account schema 

const AccountSchema = new Schema({

    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    }
    ,
    balance: {
        type: Number,
        required: true
    }

});


//create a model for the account schema
const Account = mongoose.model('Account', AccountSchema);


//export the models
module.exports = {User, Account};