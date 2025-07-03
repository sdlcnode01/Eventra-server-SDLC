const dotenv=require('dotenv')
dotenv.config()
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || 'sdlc.group01@gmail.com', // Admin Gmail ID
      pass: process.env.EMAIL_PASS || 'cksp mcqf lkrw givb', // Admin Gmail Password
    },
  })
  
  module.exports= transporter