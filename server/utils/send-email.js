"use strict";
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

exports.sendEmail = async function (emails, subject, content) {
  console.log("email: ", emails);
  console.log("content: ", content);

  try {
    if (Array.isArray(emails)) {
      emails = emails.join(", ");
    }

    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10), // Ensure port is a number
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"abc" <supports@abc.ru>', // sender address
      to: emails, // list of receivers
      subject: subject, // Subject line
      html: content, // html body
    });

    console.log("Email sent: %s", info.messageId); // Log the message ID
    return true; // Return true on success
  } catch (error) {
    console.error("Error sending email:", error); // Log the error
    throw error; // Throw the error to be caught by the caller
  }
};