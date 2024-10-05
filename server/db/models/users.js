const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    user_type : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user_types"
    },
    image : {
        type : String,
    }
});

module.exports = mongoose.model("users", userSchema);