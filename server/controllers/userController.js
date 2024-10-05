const user_types = require('../db/models/user_types');
const users = require('../db/models/users');
const { error_function, success_function } = require('../utils/response-handler');
const bcrypt = require('bcryptjs');

//create user
exports.createUser = async function(req, res) {
    let password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hashed_password = bcrypt.hashSync(password, salt);
    console.log("hashed : ",hashed_password);
    req.body.password = hashed_password;

    req.body.user_type = await user_types.findOne({user_type : req.body.user_type})._id;

    if(req.body.image){
        req.body.image =  await fileUpload(req.body.image,"users");
    }

    try {
        await users.create(req.body);

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
            message : "user created failed"
        });
        res.status(response.statusCode).send(response);
        return;
    }
}

//get all users
exports.getAllUsers = async function(req, res) {
    try {
        let allUsers = await users.find().populate("user_type");

        let response = success_function({
            statusCode : 200,
            data : allUsers
        });
        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        console.log("error : ",error);

        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : "error while fetching all users"
        });
        res.status(response.statusCode).send(response);
        return;
    }
}

//get single user
exports.getUser = async function(req, res) {
    try {
        let user = await users.findOne({_id : req.query.id}).populate("user_type");

        let response = success_function({
            statusCode : 200,
            data : user
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

//update user details
exports.updateUser = async function(req, res) {
    try {
        if(req.body.image){
            let imagePath = await movies.findOne({_id : id});
            splittedImage = imagePath.image.split('/')[2];
            let img_path = await fileUpload(image,"users");
            req.body.image = img_path;
        }
        await users.updateOne({_id : req.query.id},{$set : req.body});

        if(req.body.image){
            const imagePath = path.join('./uploads', 'movie', splittedImage);
            fileDelete(imagePath);
        }
        let response = success_function({
            statusCode : 200,
            message : "data updated successfully"
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

//delete user
exports.deleteUser = async function(req, res) {
    try {
        await users.deleteOne({_id : req.query.id});

        let response = success_function({
            statusCode : 200,
            message : "data deleted successfully"
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