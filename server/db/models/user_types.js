const mongoose = require('mongoose');

const userTypeShema = new mongoose.Schema({
    user_type : {
        type : String
    }
});

module.exports = mongoose.model("user_types",userTypeShema);