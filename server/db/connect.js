const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function mongoConnect() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("databse connection established...");
}

module.exports = mongoConnect;