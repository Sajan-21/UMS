const bcrypt = require('bcryptjs');
const { fileUpload } = require('../utils/file_upload');
const { fileDelete } = require('../utils/file_delete');
const user_types = require('../db/models/user_types');
const users = require('../db/models/users');
const { success_function, error_function } = require('../utils/response_handler');
const email_Template = require('../utils/email-templates/setPassword').setPassword;
const sendEmail = require('../utils/send-email').sendEmail;
const path = require('path');

exports.createUser = async function(req, res) {
    try {
        let body = req.body;
        console.log("body : ",body);

        let name = body.name;
        let email = body.email;

        function generateRandomPassword(length) {
            let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let password = "";
            
            for(var i = 0; i < length; i++) {
                var randomIndex = Math.floor(Math.random()*charset.length);
                password += charset.charAt(randomIndex);
            }
            return password;
        }

        var randomPassword = generateRandomPassword(12);
        console.log("random password : ",randomPassword);

        // let email_template = await email_Template(name, email, randomPassword);
        // await sendEmail(email, "password created", email_template);

        const salt = bcrypt.genSaltSync(10);
        let hashed_password = bcrypt.hashSync(randomPassword,salt);

        let user_type = body.user_type;
        console.log("user_type : ",user_type);
        user_type_collection = await user_types.findOne({user_type});
        console.log("user_type_collection : ",user_type_collection);
        user_type = user_type_collection._id;
        // console.log("user_type : ",user_type);
        body.user_type = user_type;

        if(body.image) {
            let b64image = body.image;
            image = await fileUpload(b64image,"users");
            console.log("image : ",image);

            body = {
                name,
                email,
                password : hashed_password,
                user_type : body.user_type,
                image
            }
        }else{
            body = {
                name,
                email,
                password : hashed_password,
                user_type : body.user_type,
            }
        }

        await users.create(body);

        let response = success_function({
            statusCode : 200,
            message : "user created successfully"
        });
        res.status(response.statusCode).send(response);
        return;

    } catch (error) {
        console.log("error : ",error);
        let response = error_function({
            statusCode : 400,
            message : "user creation failed"
        });
        res.status(response.statusCode).send(response);
        return;
    }
}

exports.getUsers = async function(req, res) {
    try {
        let allUsers = await users.find().populate("user_type");
        console.log("users : ",users);
        let response = success_function({
            statusCode : 200,
            data : allUsers
        });
        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        console.log("error : ",error);
    }
}

exports.getUser = async function(req, res) {
    try {
        let id = req.params.id;
        console.log("id : ",id);
        let user = await users.findOne({_id : id}).populate("user_type");
        console.log("user : ",user);
        let response = success_function({
            statusCode : 200,
            data : user
        });
        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        console.log("error : ",error);
    }
}

exports.updateUser = async function(req, res) {
    try {
        let body = req.body;
        // console.log("body : ",body);
        let id = req.params.id;
        console.log("id : ",id);
        let name = body.name;
        let email = body.email;
        let user_type = body.user_type;
        let user_type_collection = await user_types.findOne({user_type});
        user_type = user_type_collection._id;

        let splittedImage;

        if(body.image) {
            let image = body.image;
            let imagePath = await users.findOne({_id : id});
            splittedImage = imagePath.image.split('/')[2];
            image = await fileUpload(image,"users");
            body = {
                name,
                email,
                user_type,
                image,
            }
        }else{
            body = {
                name,
                email,
                user_type,
            }
        }
        await users.updateOne({_id : id},{$set : body});

        if(body.image){
            let dltImg = path.join('./uploads', 'users', splittedImage);
            fileDelete(dltImg);
        }

        let response = success_function({
            statusCode : 200,
            message : "user updation successfull"
        });
        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        console.log("error : ",error);
    }
}

exports.resetPassword = async function(req, res) {
    try {
        let id = req.params.id;
        console.log("id : ",id);
        let body = req.body;
        let user = await users.findOne({ _id: id });
        console.log("user in reset function : ",user);

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
            console.log("password matched");

            const salt = bcrypt.genSaltSync(10);
            let new_hashed_password = bcrypt.hashSync(newPassword, salt);

            // Update the password
            let updatedUser = await users.updateOne({ _id: id }, { $set: { password: new_hashed_password } });

            console.log("user after reset : ",updatedUser);

            let response = success_function({
                statusCode: 200,
                message: "Password reset successfully"
            });
            res.status(response.statusCode).send(response);
            return;
        } else {
            let response = error_function({
                statusCode: 400,
                message: "Current password is not correct, try again"
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
        return;
    }
}

exports.deleteUser = async function(req, res) {
    try {
        let id = req.params.id;
        // console.log("id : ",id);
        await users.deleteOne({_id : id});
        let response = success_function({
            statusCode : 200,
            message : "user deleted successfully"
        });
        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        console.log("error : ",error);
    }
}