const { error_function, succes_function } = require("../utils/response-handler");
const users = require('../db/models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.login = async function(req, res) {
    try {
        let body = req.body;
        console.log("body : ",body);
        let email = body.email;
        console.log("email : ",email);
        let password = body.password;
        console.log("password : ",password);
        if(!body.email){
            let response = error_function({
                statusCode : 400,
                message : "email required",
            });
            res.status(response.statusCode).send(response);
            return;
        }
        if(!body.password){
            let response = error_function({
                statusCode : 400,
                message : "password required",
            });
            res.status(response.statusCode).send(response);
            return;
        }
        let user = await users.findOne({email}).populate('user_type');
        if(!user){
            let response = error_function({
                statusCode : 400,
                message : "user not found",
            });
            res.status(response.statusCode).send(response);
            return;
        }else{
            console.log("user in login : ",user);
            let check_password = bcrypt.compareSync(password, user.password);
            if(!check_password) {
                let response = error_function({
                    statusCode : 400,
                    message : "incorrect password. try again",
                });
                res.status(response.statusCode).send(response);
                return;
            }else {
                let token = jwt.sign({user_id : user.id}, process.env.PRIVATE_KEY, {expiresIn : "10d"});
                await users.updateOne({email}, {$set : {login_count : null}});

                let response = succes_function({
                    statusCode : 200,
                    message : "Login successfully",
                    data : {
                        token,
                        user_type : user.user_type.user_type,
                        id : user._id,
                        password_count : user.reset_password_count,
                        login_count : user.login_count
                    }
                });
                res.status(response.statusCode).send(response);
                return;
            }
        }
    } catch (error) {
        console.log("error : ",error);
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : error
        });
        res.status(response.statusCode).send(response);
        return;
    }
}