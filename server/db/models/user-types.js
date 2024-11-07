const mongoose = require('mongoose');

const user_typesSchema = new mongoose.Schema({
    user_type : {
        type : String,
        required : true
    }
});
module.exports = mongoose.model("user_types",user_typesSchema);