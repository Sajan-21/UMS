const express = require('express');
const app = express();
const mongoConnect = require('./db/connect');
mongoConnect();
const dotenv = require('dotenv');
dotenv.config();
const userRouter = require('./routers/user-routes');
const authRouter = require('./routers/auth-routes');

app.use(express.static('../client'));
app.use(express.urlencoded({extended : true}));
app.use('/uploads',express.static("./uploads"));
app.use(express.json());
app.use(userRouter);
app.use(authRouter);


app.listen(process.env.PORT, () => {
    console.log(`server running at http://localhost:${process.env.PORT}`);
});