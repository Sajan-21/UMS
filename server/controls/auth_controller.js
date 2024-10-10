const users = require('../db/models/users');
const bcrypt = require('bcryptjs');
const { error_function, success_function } = require('../utils/response_handler');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const user_types = require('../db/models/user_types');
dotenv.config();

exports.login = async function(req, res) {
    console.log("login router correct");
    let body = req.body;
    console.log("body : ",body);
    let email = body.email;
    console.log("email : ",email);
    try {
        let user = await users.findOne({email}).populate("user_type");
        console.log("user : ",user);
        if(user) {
            let password = body.password;
            console.log("password : ",password);
            let db_password = user.password;
            let check_password = bcrypt.compareSync(password, db_password);
            if(check_password) {
                let token = jwt.sign({user_id : user.id},process.env.PRIVATE_KEY,{expiresIn : "10d"});
                console.log("token : ",token);
                let response = success_function({
                    statusCode : 200,
                    message : "user login successfully",
                    data : {
                        token,
                        user_type : user.user_type.user_type,
                        id : user._id
                    }
                });
                res.status(response.statusCode).send(response);
                return;
            }else{
                let response = error_function({
                    statusCode : 400,
                    message : "password isn't matching try again"
                });
                res.status(response.statusCode).send(response);
                return;
            }
        }else{
            let response = error_function({
                statusCode : 400,
                message : "user not found"
            });
            res.status(response.statusCode).send(response);
            return;
        }
    } catch (error) {
        console.log("error : ",error);
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : "something"
        });
        res.status(response.statusCode).send(response);
        return;
    }
}