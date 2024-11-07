const users = require("../db/models/users");
const user_types = require('../db/models/user-types');
const { error_function,succes_function } = require("../utils/response-handler");
const email_Template = require('../utils/mail-templates/password-template').setPassword;
const sendEmail = require('../utils/send-email').sendEmail;
const bcrypt = require('bcryptjs');
const fileUpload = require('../utils/file-upload').fileUpload;
const fileDelete = require('../utils/file-delete').fileDelete;
const path = require('path');

exports.createUser = async function(req, res) {
    try {
        let body = req.body;

        if(!body.name) {
            let response = error_function({
                statusCode : 400,
                message : "name required",
            });
            res.status(response.statusCode).send(response);
            return;
        }
        if(!body.email) {
            let response = error_function({
                statusCode : 400,
                message : "email required",
            });
            res.status(response.statusCode).send(response);
            return;
        }
        function generateRandomPassword(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }
        let random_password = generateRandomPassword(10);
        console.log("random_password : ",random_password);
        // let email_template = await email_Template(body.name, body.email, random_password);
        // await sendEmail(email, "password created", email_template);
        var salt = bcrypt.genSaltSync(10);
        var hashed_password = bcrypt.hashSync(random_password, salt);
        body.password = hashed_password;

        if(body.image) {
            let b64 = body.image;
            let image = await fileUpload(b64,"users");
            console.log("image : ",image);
            body.image = image;
        }
        let user_type_id = await user_types.findOne({user_type : "Employee"});
        console.log("user_type_id : ",user_type_id);
        body.user_type = user_type_id._id;
        body.reset_password_count = 0;
        body.login_count = 0;
        console.log("body : ",body);

        await users.create(body);

        let response = succes_function({
            statusCode : 200,
            message : "user created succesfully"
        });
        res.status(response.statusCode).send(response);
        return;

    } catch (error) {
        console.log("error : ",error);
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : "something went wrong"
        });
        res.status(response.statusCode).send(response);
        return;
    }
}

exports.resetPassword = async function(req, res) {
    try {
        let id = req.params.id;
        console.log("id : ",id);
        let body = req.body;
        let user = await users.findOne({ _id : id });
        console.log("user : ",user);
        if (!user) {
            let response = error_function({
                statusCode: 404,
                message: "User not found"
            });
            res.status(response.statusCode).send(response);
            return;
        }

        let currentPassword = body.currentPassword;
        let newPassword = body.newPassword;

        // Correct bcrypt comparison: compare plaintext with hashed password
        let compare_Current_Password = bcrypt.compareSync(currentPassword, user.password);

        if (compare_Current_Password) {
            const salt = bcrypt.genSaltSync(10);
            let new_hashed_password = bcrypt.hashSync(newPassword, salt);

            // Update the password
            await users.updateOne({ _id : id }, { $set : { password : new_hashed_password, reset_password_count : null } });
            console.log("user.resetpassword___count : ",user.reset_password_count,typeof(user.reset_password_count));
            console.log("user.login_count : ",user.login_count,typeof(user.login_count));

            let response = succes_function({
                statusCode: 200,
                message: "Password reset successfully",
                data: {reset_password_count : JSON.stringify(user.reset_password_count),
                    login_count : JSON.stringify(user.login_count),
                }
            });
            res.status(response.statusCode).send(response);

            return;
        } else {
            let response = error_function({
                statusCode: 400,
                message: "Current password is not correct, try again",
            });
            res.status(response.statusCode).send(response);
            return;
        }
    } catch (error) {
        console.log("Error: ", error);
        let response = error_function({
            statusCode: 500,
            message: "An error occurred while resetting the password"
        });
        res.status(response.statusCode).send(response);
    }
}

exports.getUsers = async function(req, res) {
    try {
        let datas = await users.find().populate('user_type');
        let response = succes_function({
            statusCode : 200,
            data : datas,
        });
        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        console.log("error : ",error);
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : "something went wrong"
        });
        res.status(response.statusCode).send(response);
        return;
    }
}

exports.getUser = async function (req, res) {
    try {
        let id = req.params.id;
        let user = await users.findOne({_id : id}).populate('user_type');
        let response = succes_function({
            statusCode : 200,
            data : user,
        });
        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        console.log("error : ",error);
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : "something went wrong"
        });
        res.status(response.statusCode).send(response);
        return;
    }
}

exports.updateUser = async function(req, res) {
    try {
        let id = req.params.id;
        let body = req.body;

        if(!body.name) {
            let response = error_function({
                statusCode : 400,
                message : "name required",
            });
            res.status(response.statusCode).send(response);
            return;
        }
        if(!body.email) {
            let response = error_function({
                statusCode : 400,
                message : "email required",
            });
            res.status(response.statusCode).send(response);
            return;
        }
        let img_path_to_delete;
        let image_to_Delete;
        if(body.image) {
            let b64 = body.image;
            let user = await users.findOne({_id : id});
            if(user.image){
                console.log("user : ",user.image);
                img_path_to_delete = user.image.split('/')[2];
            }else{
                image_to_Delete = null;
            }
            let image = await fileUpload(b64,"users");
            console.log("image : ",image);
            body.image = image;
        }

        await users.updateOne({_id : id}, {$set : body});

        if(body.image){
            if(image_to_Delete !== null){
                let image_to_Delete = path.join('./uploads', 'users', img_path_to_delete);
                fileDelete(image_to_Delete);
            }
        }

        let response = succes_function({
            statusCode : 200,
            message : "user updated successfully"
        });
        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        console.log("error : ",error);
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : "something went wrong"
        });
        res.status(response.statusCode).send(response);
        return;
    }
}

exports.deleteUser = async function(req, res) {
    try {
        let id = req.params.id;
        await users.deleteOne({_id : id});

        let response = succes_function({
            statusCode : 200,
            message : "user deleted successfully"
        });
        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        console.log("error : ",error);
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : "something went wrong"
        });
        res.status(response.statusCode).send(response);
        return;
    }
}

exports.forgotPassword = async function(req, res) {
    try {
        let id = req.params.id;
        let body = req.body;
        let new_password = body.password;
        let user = await users.findOne({_id : id});
        await users.put({_id : id},{$set : {password : new_password, reset_password_count : user.reset_password_count+1}});

        let response = succes_function({
            statusCode : 200,
            message : "new password setting successfully"
        });
        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        console.log("error : ",error);
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : "something went wrong"
        });
        res.status(response.statusCode).send(response);
        return;
    }
}