// //npm i mailgun
// require('dotenv').config()
// const password = process.env.password
// const formData = require("form-data");
// const Mailgun = require("mailgun.js");
// const mailgun = new Mailgun(formData);
// const mg = mailgun.client({
//   username: "api",
//   key: process.env.MAILGUN_API_KEY, // your Mailgun API key
// });

// // Load API Key & Domain from environment variables for safety

//  exports.sendEmail = async ({from,to,subject,html})=>{
//   try {
//     const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
//       from, // must be verified domain in Mailgun
//       to,
//       subject,
//       html
//     });

//     console.log("Email sent:", response);
//   } catch (err) {
//     console.error("Error sending email:", err);
//   }
// }

