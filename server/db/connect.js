const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

async function mongoConnect () {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("database connection established...");
    } catch (error) {
        console.log("error while connecting database : ",error);
    }
}
module.exports = mongoConnect;