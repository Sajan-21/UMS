const mongoose = require('mongoose');
const user_types = require('./user_types');

const usersSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    user_type : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user_types"
    },
    image : {
        type : String
    },
    firstLogin : {
        type : String
    }
});
module.exports = mongoose.model("users",usersSchema);