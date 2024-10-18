const users = require('../db/models/users');
const bcrypt = require('bcryptjs');
const { error_function, success_function } = require('../utils/response_handler');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const user_types = require('../db/models/user_types');
dotenv.config();
const forgetPasswordTemplate = require('../utils/email-templates/forgetPassword').forgetPasswordTemplate;
const sendEmail = require('../utils/send-email').sendEmail;

exports.login = async function(req, res) {
    let fLogin = 0;
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

                if (!user.firstLogin) {
                    // Set first login time if it doesn't exist
                    user.firstLogin = new Date();
                    await user.save();
                    fLogin ++;
                    console.log("This is the user's first login!");
                } else {
                    console.log("User first logged in on: ", user.firstLogin);
                }

                console.log("flag : ",fLogin);
                let response = success_function({
                    statusCode : 200,
                    message : "user login successfully",
                    data : {
                        token,
                        user_type : user.user_type.user_type,
                        id : user._id,
                        flag : fLogin
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

exports.forgetPassword = async function(req,res) {
    let body = req.body;
    console.log("body : ",body);
    let email = body.email;
    console.log("email : ",email);
    try {
        let user = await users.findOne({email : email});
        console.log("user : ",user);
        if(user) {
            let reset_token = jwt.sign({user_id : user._id}, process.env.PRIVATE_KEY, {expiresIn : "10d"});
            await user.updateOne({email}, {$set : {password_token : reset_token}});
            let resetLink = `${process.env.FRONTEND_URL}?token=${reset_token}`;
            let email_template = await forgetPasswordTemplate(user.name, resetLink);
            await sendEmail(user.email, "forget password", email_template);
            let response = success_function({
                statusCode : 200,
                message : "check your mail and follow the instructions"
            });
            res.status(response.statusCode).send(response);
            return;
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
            message : error ? error.message ? error.message : error : "Something went wrong",
          });
          res.status(response.statusCode).send(response);
          return;
    }
}

exports.passwordResetController = async function(req, res) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authorization.split(" ")[1];
        
        let password = req.body.password;

        decoded = jwt.decode(token);
        let user = await users.findOne({$and : [{_id : decoded.user_id}, {password_token : token}],});
        if(user) {
            let salt = bcrypt.genSaltSync(10);
            let hashed_password = bcrypt.hashSync(password, salt);
            let data = await users.updateOne({_id : decoded.user_id},{$set : {password : hashed_password, token : null}});
            let response = success_function({
                statusCode : 200,
                message : "password reseted successfully"
            });
            res.status(response.statusCode).send(response);
            return;
        }
    } catch (error) {
        console.log("error : ",error);
        let response = error_function({
            statusCode : 400,
            message : error ? error.message ? error.message : error : "Something went wrong",
        });
        res.status(response.statusCode).send(response);
        return;
    }
}