const {success_function, error_function} = require('../utils/response-handler');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const users = require('../db/models/users');
const control_data = require('../utils/control-data.json');


exports.accessControl = async function (access_type, req, res, next) {

    // console.log("req : ",req);

    try {

        console.log("access_type : ",access_type);

        if(access_type === "*"){

            next();

        }else{

            let token = req.headers['authorization'].split(' ')[1];;
            console.log("token : ",token);

            if(!token || token === "null" || token === null || token === "undefined" || token === undefined || token === ""){
                let response = error_function({
                    statusCode : 400,
                    message : "invalid token"
                });
                res.status(response.statusCode).send(response);
                return;
            }else{

                jwt.verify(token, process.env.PRIVATE_KEY, async (err, decoded) => {

                    if(err){
                        let response = error_function({
                            statusCode : 400,
                            message : "token authentication failed"
                        });
                        res.status(response.statusCode).send(response);
                        return;
                    }else{

                        console.log("decode : ",decoded);

                        let user_id = decoded.user_id
                        console.log("user_id : ",user_id);

                        let user = await users.findOne({_id : user_id}).populate('user_type');
                        console.log("user : ",user);
                        
                        let allowed = access_type.split(',').map((obj) => control_data[obj]);
                        console.log("allowed : ",allowed);

                        if(allowed && allowed.includes(user.user_type.user_type)){
                            next();
                        }else{
                            let response = error_function({
                                statusCode : 400,
                                message : "not allowed to access the route"
                            });
                            res.status(response.statusCode).send(response);
                            return;
                        }

                    }

                })

            }

        }
        
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