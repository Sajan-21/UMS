const mongoose = require('mongoose');
const user_types = require('../models/user-types');

const usersScheme = new mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    age : {
        type : Number
    },
    user_type : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user_types"
    },
    reset_password_count : {
        type : Number
    },
    login_count : {
        type : Number
    },
    image : {
        type : String
    }
});

module.exports = mongoose.model("users",usersScheme);