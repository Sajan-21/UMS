const express = require('express');
const app = express();
const mongoConnect = require('../server/db/connect');
mongoConnect();
const userRouter = require('./routers/user_Router');
const authRouter = require('./routers/auth_Router')

app.use(express.static('../client'));
app.use(express.json({limit : "1024mb"}));
app.use(express.urlencoded({extended : true}));
app.use('/uploads',express.static("./uploads"));
app.use(userRouter);
app.use(authRouter);


app.listen(process.env.PORT, () => {
    console.log(`server running at http://localhost:${process.env.PORT}`);
});