const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoConnect = require('./db/connect');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.get('/test', (req, res) => {
    res.status(200).send("Test successful");
});

//Serving static files
app.use(express.static( "../client"));
app.use('/uploads',express.static("./uploads"));

//Database connection
mongoConnect();

//Parse JSON Datas
app.use(express.json({limit : "100mb"}));

//Parse form datas
app.use(express.urlencoded({extended : true}));

//userRoutes
app.use(userRoutes);

//authRoutes
app.use(authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});