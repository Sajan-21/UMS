"use strict";
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

exports.sendEmail = async function(emails, subject, content) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("email sendEmail : ",emails);
            console.log("content : ",content);
            if(typeof emails == "object") emails = emails.join(", ");

            let transporter = nodemailer.createTransport({
                host : process.env.EMAIL_HOST,
                port : process.env.EMAIL_PORT,
                secure : process.env.EMAIL_PORT == 465 ? true : false,
                auth : {
                    user : process.env.EMAIL_USER,
                    pass : process.env.EMAIL_PASSWORD,
                },
            });
            console.log("transporter : ",transporter);
            let info = await transporter.sendMail({
                from : '"pomograd" <support@pomograd.ru>',
                to : emails,
                subject : subject,
                html : content,
            });
            // console.log("info : ",info);
            resolve(true);
        } catch (error) {
            reject(false);
        }
    });
};