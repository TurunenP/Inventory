// // services/sendGridEmail.js
// const sgMail = require("@sendgrid/mail");
// require("dotenv").config();

// // Set the SendGrid API key
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// // Function to send email
// const sendGridEmail = async (to, subject, text, html) => {
//   const msg = {
//     to: "course.projects@outlook.com",
//     from: process.env.EMAIL_USER, // Your verified sender email
//     subject: "Test Email",
//     text: "This is a test email sent from SendGrid.",
//     html: "<strong>This is a test email sent from SendGrid.</strong>",
//   };

//   try {
//     // Send the email using SendGrid
//     await sgMail.send(msg);
//     console.log("Email sent successfully");
//   } catch (error) {
//     // Log the error and throw a new error with the specific message
//     console.error("Error sending email:", error.response.body);
//     throw new Error(
//       error.response.body.errors[0]?.message || "Failed to send email"
//     );
//   }
// };

// module.exports = sendGridEmail;

// services/sendGridEmail.js
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send email
const sendGridEmail = async (to, subject, text, html) => {
  const msg = {
    to: to, // Recipient's email address
    from: process.env.EMAIL_USER, // Your verified sender email
    subject: subject, // Subject of the email
    text: text, // Plain text version of the email
    html: html, // HTML version of the email
  };
  console.log("Sending email to:", to); // Debugging log

  try {
    // Send the email using SendGrid
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error.response.body);
    throw new Error(
      error.response.body.errors[0]?.message || "Failed to send email"
    );
  }
};

module.exports = sendGridEmail;
