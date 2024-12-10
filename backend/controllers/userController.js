const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail"); // Nodemailer

//const sendEmail = require("../services/sendEmail"); 
const sendGridEmail = require("../services/sendGridEmail");

//Generate jwt token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//Register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be upto 6 characters");
  }

  //Check user email already exists
  const userExists = await User.findOne({ email });
  //console.log(userExists);

  if (userExists) {
    res.status(400);
    throw new Error("Email already been registered");
  }

  //Hash the password before creating the user
  const hashedPassword = await bcrypt.hash(password, 10); // Hashing with a salt rounds of 10

  // Check if user was created and respond accordingly
  const user = await User.create({
    name,
    email,
    // password,
    password: hashedPassword,
  });

  //Generate Token AFTER user is created
  const token = generateToken(user._id);
  
  //Send HTTP only cookie to frontend
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //One(1) day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, phone, bio, photo } = user;
    res.status(201).json({
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
  // if(!req.body.email){
  //     res.status(400)
  //     throw new Error('Please add an email')
  // }
  // res.send('Register User')
});

//Login user
const loginUser = asyncHandler(async (req, res) => {
  //res.send('Login User')
  const { email, password } = req.body;
  console.log("Received email:", email);
  console.log("Received password:", password);

  //Validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }

  //Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    console.log("User not found:", email);
    res.status(400);
    throw new Error("User not fouNd, please signup");
  } else {
    console.log("User found:", user.email, user.password); // Check the retrieved user details
  }

  //User exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
console.log("Password is correct:", passwordIsCorrect);

  //Generate token
  const token = generateToken(user._id);

  //Send HTTP only cookie to frontend
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //One(1) day
    sameSite: "none",
    secure: true,
  });

  //Get user info
  if (user && passwordIsCorrect) {
    const { _id, name, email, phone, bio, photo } = user;
    res.status(200).json({
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

//Logout user
const logout = asyncHandler(async (req, res) => {
  // res.send('Logout user')

  // Clear the token cookie
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  //return res.send(200).json({ message: "Succesfully Logged out" });
  // Return success response
  res.status(200).json({ message: "Successfully Logged out" });
});

//Get user profile/data
const getUser = asyncHandler(async (req, res) => {
  //res.send('Get User Data')
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, phone, bio, photo } = user;
    res.status(200).json({
      _id,
      name,
      email,
      phone,
      bio,
      photo,
    });
  } else {
    res.status(400);
    throw new Error("User not Found");
  }
});

//Get login status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  //Verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
  //res.send('Login status')
});

//Update user
const updateUser = asyncHandler(async (req, res) => {
  //res.send('User updated')
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, phone, bio, photo } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      photo: updatedUser.photo,
    });
  } else {
    res.status(404);
    throw new Error("User not Found");
  }
});

//Change password
const changePassword = asyncHandler(async (req, res) => {
  // res.send('Password Changed')

  const user = await User.findById(req.user._id);

  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User not Found, please signup");
  }
  //Validate
  if (!oldPassword || !password) {
    res.status(404);
    throw new Error("Please add old and new password");
  }

  //Check if password matches password in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);
console.log(
  "Comparing provided password with hashed password:",
  password,
  user.password
);


  //Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password changed succesfully");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});

//Forgot password

const forgotPassword = asyncHandler(async (req, res) => {
  //res.send("Forgot Password");
  const { email } = req.body;
  const user = await User.findOne({ email });
  console.log("User found:", user ? user.email : "No user found");

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  //Delete Token if it exists in DB
let token = await Token.findOne({ userId: user._id });
if (token) {
  await token.deleteOne()
}

  //Create a reset Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken)

  //Hash token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //console.log(hashedToken)

  //Save Token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), //30 mins
  }).save();

  //Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Plain text email content
//   const text = `Hello ${user.name},
  
// Please use the following link to reset your password:
// ${resetUrl}
  
// This link is valid for 30 minutes.

// Regards,
// Your Company`;

  //Reset Email
  const message = `
<h2>Hello ${user.name}</h2>
<p>Please use the url below to reset your password</p>
<p>Please reset link is valid for only 30 minutes</p>

<a href=${resetUrl} clicktracking=off> ${resetUrl}</a>

<p>Regards...</p>

<p>Project App</p>
`;

  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  //res.send('Forgot pass')
  try {
    // Using SendGrid to send the email
    await sendGridEmail(send_to, subject, message, message); // SendGrid email service
    // Or use Nodemailer
    // await sendEmail(subject, message, send_to, sent_from); // Nodemailer email service

    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});


//Reset Password

const resetPassword = asyncHandler (async (req, res) => {
  //res.send('Reset Password')

  const {password} = req.body
   const { resetToken } = req.params;

//Hash token, then compare to the one in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

      //Find token in DB
      const userToken = await Token.findOne({
        token: hashedToken,
        expiresAt: {$gt: Date.now()}
      })

      if (!userToken) {
        res.send(404)
        throw new Error ('Invalid or Expired token')
      }

      //Find user(if token has not expired)
      const user = await User.findOne({_id: userToken.userId})
      user.password = password
      await user.save()
      res.status(200).json({
        message: 'Password Reset Successful, please Login'
      })
})

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};

