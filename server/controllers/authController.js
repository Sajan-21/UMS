const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;
const users = require('../db/models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const user_types = require('../db/models/user_types');
dotenv.config();

exports.login = async function (req, res) {
    try {

        let email = req.body.email;
        console.log("email : ", email);

        let password = req.body.password;
        console.log("password : ", password);

        //Validations

        let user = await users.findOne({email}).populate("user_type");
        console.log("user : ", user);

        let user_type = user.user_type.user_type;

        if(user) {

            let db_password = user.password;
            console.log("db_password : ", db_password);

            let passwordMatch = bcrypt.compareSync(password, db_password);
            console.log("passwordMatch : ", passwordMatch);

            if(passwordMatch) {

                let token = jwt.sign({user_id : user._id}, process.env.PRIVATE_KEY, {expiresIn : "10d"});
                console.log("token : ",token);

                let response_data = {
                    token,
                    id : user._id,
                    email : user.email,
                    user_type,
                }

                let strData = JSON.stringify(response_data);
                
                let response = success_function({
                    statusCode : 200,
                    data : strData,
                    message : "Login successful",
                });

                res.status(response.statusCode).send(response);
                return;
            }else {

                let response = error_function({
                    statusCode : 400,
                    message : "Invalid password",
                });

                res.status(response.statusCode).send(response);
                return;
            }

        }else {
            let response = error_function({
                statusCode : 404,
                message : "User not found",
            });

            res.status(response.statusCode).send(response);
            return;
        }
        
    } catch (error) {
        
        console.log("error : ", error);

        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : "Something went wrong",
        });

        res.status(response.statusCode).send(response);
        return;
    }
}