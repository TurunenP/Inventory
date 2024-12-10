// const asyncHandler = require("express-async-handler");
// const User = require ('../models/userModel')
// const sendEmail = require ('../utils/sendEmail');
// const { useAsyncError } = require("react-router-dom");

// const contactUs = asyncHandler(async (req, res) => {
//   res.send("Contact Us");
// //   const {subject, message} = req.body
// //   const user = await User.findById(req.user._id)

// //   if (!user) {
// //     res.status(400)
// //     throw new Error ('User not found, please signup')
// //   }

// //     //Validation
// //     if (!subject || !message) {
// //          res.status(400);
// //          throw new Error("Please add subjects and message");
// //     }

// //     const send_to = process.env.EMAIL_USER;
// //      const sent_from = process.env.EMAIL_USER;
// //       const reply_to = user.email;

// //      try {
// //     await sendEmail(send_to, subject, message, sent_from, reply_to); 
// //     res.status(200).json({ success: true, message: "Email Sent" });
// //   } catch (error) {
// //     res.status(500);
// //     throw new Error("Email not sent, please try again");
// //   }
// });


// module.exports = {
//   contactUs,
// };


// controllers/contactController.js

const asyncHandler = require("express-async-handler");
const sendEmail = require('../utils/sendEmail'); // Import the sendEmail function

const contactUs = asyncHandler(async (req, res) => {
  const { subject, message } = req.body; // Destructure subject and message from the request body

  // Simple validation
  if (!subject || !message) {
    return res.status(400).json({ success: false, message: "Subject and message are required." });
  }

  const send_to = process.env.EMAIL_USER; // The email address you want to send the email to
  const sent_from = process.env.EMAIL_USER; // The email address the email is sent from (your SMTP user)
  const reply_to = req.user.email; // The reply-to email, assuming the user is authenticated and has an email

  try {
    // Send email
    await sendEmail(subject, message, send_to, sent_from, reply_to);
    return res.status(200).json({ success: true, message: "Email sent successfully." });
  } catch (error) {
     console.error("Email sending error:", error.message); 
    return res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

module.exports = {
  contactUs,
};
