// 

const nodemailer = require("nodemailer");
require("dotenv").config(); // make sure .env is loaded

exports.sendMail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host:"smtp.gmail.com",
      auth: {
        user: process.env.user,  // full Gmail address
        pass: process.env.pass,  // Gmail App Password
      },
    });
 
    const info = await transporter.sendMail({
      from: process.env.user,
      to,
      subject,
      text,
      html,
      replyTo:"no-reply@nowhere.com"
    });

    return info;
  } catch (error) {
    console.log("error sending:", error.message);
  }
};


