const { Validator } = require('node-input-validator');
const { errorCode } = require('../../../Helper/response');
const attendeeRepositories = require('../Repositories/attendee.repositories')
const { hashpassword } = require('../../../Helper/auth');
const bycript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const transporter = require('../../../Config/emailConfig');
const { exist } = require('joi');
const testimonialRepo = require('../Repositories/testimonial.repo');
const eventRepositories = require('../../Event/repositories/event.repositories');
const { attendeeSchema } = require('../Model/attendee.model');
class attendeeController {

    // attendee register
    async register(req, res) {
        try {
            const { error } = attendeeSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const { first_name, last_name, email, phone, dob, gender, password, image } = req.body

            // Check if the attendee is Over thirteen years old
            const currentDate = new Date();
            const birthDate = new Date(dob);
            const age = currentDate.getFullYear() - birthDate.getFullYear();
            const monthDifference = currentDate.getMonth() - birthDate.getMonth();
            const isThirteenPlus = age > 13 || (age === 13 && monthDifference >= 0);

            const attendeeexist = await attendeeRepositories.existattendee(email)
            const hashedpassword = await hashpassword(password)

            if (attendeeexist) {
                console.log(attendeeexist)
                if (attendeeexist.isdelete) {
                    const id = attendeeexist._id
                    const data = {
                        first_name,
                        last_name,
                        email,
                        phone,
                        dob,
                        gender,
                        password: hashedpassword,
                        isThirteenPlus,
                        ...(req.file && { image: req.file.path })
                    };
                    const addattendee = await attendeeRepositories.findbyemail(data, email);
                    console.log(addattendee)
                    if (addattendee) {
                        return res.status(errorCode.success).json({ message: 'Registration successfull', data: addattendee });
                    }
                }
                return res.status(errorCode.notFound).json({ message: 'attendee Already Exist' });
            }

            const data = {
                first_name,
                last_name,
                email,
                phone,
                dob,
                gender,
                password: hashedpassword,
                isThirteenPlus,
                ...(req.file && { image: req.file.path })
            };

            console.log("req.body:", req.body);
            console.log("req.file:", req.file);
            const addattendee = await attendeeRepositories.adddata(data);
            if (addattendee) {
                return res.status(errorCode.success).json({ message: 'Registration successfull', data: addattendee });
            }
            return res.status(errorCode.forbidden).json({ message: "Server Error" });

        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }
    // attendee login
    async login(req, res) {
        try {

            const v = new Validator(req.body, {
                email: "required|email",
                password: "required|minLength:6",
            });
            const matched = await v.check();
            if (!matched) {
                // If validation fails, send errors to the client
                return res.status(errorCode.unauthorized).json({ message: v.errors });
            }
            const { email, password } = req.body

            const attendeeexist = await attendeeRepositories.existattendee(email)

            if (!attendeeexist) {
                // If validation fails, send errors to the client
                return res.status(errorCode.forbidden).json({ message: "Invalid email" });
            }
            if (attendeeexist.isdelete) {
                return res.status(errorCode.forbidden).json({ message: "Email Not Found" });
            }
            if (attendeeexist.isadmindelete) {
                return res.status(errorCode.forbidden).json({ message: "Your account delete", admin_msg: attendeeexist.admin_msg });
            }
            const passwordchack = await bycript.compare(password, attendeeexist.password)
            if (!passwordchack) {
                return res.status(errorCode.forbidden).json({ message: 'Invalid password' });
            }
            if (attendeeexist.role == 'attendee') {
                const token = jwt.sign({
                    _id: attendeeexist._id,
                    first_name: attendeeexist.first_name,
                    last_name: attendeeexist.last_name,
                    phone: attendeeexist.phone,
                    email: attendeeexist.email,
                    age: attendeeexist.age,
                    role: attendeeexist.role
                }, process.env.JWTSECRECT || 'WEBSKITTERPROJECTSDLCHILOKNLUIKD', { expiresIn: '2h' })

                res.cookie('attendeetoken', token, { maxAge: 7200000, httpOnly: true })

                return res.status(errorCode.success).json({ message: 'Login successful', token: token, attendeedata: attendeeexist });
            }
            return res.status(errorCode.notFound).json({ message: 'Only Attendee Can Login', });


        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }
    // OTP SEND
    async otpsend(req, res) {
        try {
            console.log('email')
            const v = new Validator(req.body, {
                email: "required|email",
            });
            const matched = await v.check();
            if (!matched) {
                // If validation fails, send errors to the client
                return res.status(errorCode.unauthorized).json({ message: v.errors });
            }
            const { email } = req.body
            console.log(email)
            const otp = Math.floor(1000 + Math.random() * 9000);
            const data = {
                email: email,
                otp: otp
            }
            const otpsendverifydata = await attendeeRepositories.otpdatafind(email)
            if (otpsendverifydata) {
                if (otpsendverifydata.isotpsend) {
                    // return res.status(errorCode.notFound).json({ message: 'Otp Already Send'});
                    await attendeeRepositories.otpdatadelete(otpsendverifydata._id)
                }

            }
            const otpdata = await attendeeRepositories.otpsave(data)
            if (otpdata) {
                const info = await transporter.sendMail({
                    from: `"Eventra" <${process.env.EMAIL_FROM}>`,
                    to: email,
                    subject: "OTP Verification",
                    html: `<!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>OTP Verification</title>
                                    <style>
                                        body {
                                            font-family: Arial, sans-serif;
                                            background-color: #f4f4f4;
                                            margin: 0;
                                            padding: 0;
                                        }
                                        .email-container {
                                            width: 100%;
                                            max-width: 600px;
                                            margin: 0 auto;
                                            background-color: #ffffff;
                                            padding: 20px;
                                            border-radius: 8px;
                                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                        }
                                        .header {
                                            text-align: center;
                                            margin-bottom: 20px;
                                        }
                                        .otp-code {
                                            font-size: 24px;
                                            font-weight: bold;
                                            color: #4CAF50;
                                            text-align: center;
                                            margin-bottom: 20px;
                                        }
                                        .message {
                                            font-size: 16px;
                                            color: #333333;
                                            margin-bottom: 20px;
                                        }
                                        .footer {
                                            font-size: 14px;
                                            color: #777777;
                                            text-align: center;
                                            margin-top: 20px;
                                        }
                                        .btn {
                                            display: inline-block;
                                            background-color: #4CAF50;
                                            color: white;
                                            padding: 10px 20px;
                                            font-size: 16px;
                                            text-decoration: none;
                                            border-radius: 4px;
                                            text-align: center;
                                            margin-top: 20px;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div class="email-container">
                                        <div class="header">
                                            <h2>OTP Verification</h2>
                                        </div>
                                        <div class="message">
                                            <p>Hello,</p>
                                        
                                            <p>Thank you for signing up. Your One-Time Password (OTP) is:</p>
                                        </div>
                                        <div class="otp-code">
                                            <strong>${otpdata.otp}</strong>
                                        </div>
                                        <div class="message">
                                            <p>Please use this OTP to complete your verification. If you did not request this OTP, please ignore this email.</p>
                                        </div>
                                        <div class="footer">
                                            <p>Best regards,</p>
                                            <p>Your Company Name</p>
                                        </div>
                                    </div>
                                </body>
                                </html>`, // html body
                });
            }

            return res.status(errorCode.success).json({ message: 'OTP Send Successful' });
        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }

    }

    // otp verification 
    async otpverify(req, res) {
        try {
            const v = new Validator(req.body, {
                email: "required|email",
                otp: "required|minLength:4",
            });

            const matched = await v.check();
            if (!matched) {
                return res.status(errorCode.unauthorized).json({ message: v.errors });
            }

            const { email, otp } = req.body;
            const otpdata = await attendeeRepositories.otpdatafind(email);

            if (!otpdata) {
                return res.status(errorCode.forbidden).json({ message: 'Invalid OTP. Please resend OTP.' });
            }

            if (otpdata.isverify) {
                return res.status(errorCode.notFound).json({ message: 'Email already verified.' });
            }

            // Match OTP (convert both to strings to avoid type mismatch)
            if (String(otp) !== String(otpdata.otp)) {
                return res.status(errorCode.forbidden).json({ message: 'Invalid OTP.' });
            }

            // Expiry check: 2 minutes
            const currentTime = new Date();
            const expirationTime = new Date(otpdata.createdAt.getTime() + 2 * 60 * 1000);

            if (currentTime > expirationTime) {
                await attendeeRepositories.otpdatadelete(otpdata._id);
                return res.status(errorCode.forbidden).json({ message: 'OTP expired!' });
            }

            // Verify & delete OTP
            const delotp = await attendeeRepositories.otpdatadelete(otpdata._id);
            await attendeeRepositories.verify(email); // Mark user as verified

            return res.status(errorCode.success).json({ message: 'OTP Verified Successfully' });

        } catch (error) {
            console.error(error);
            return res.status(errorCode.serverError).json({ message: error.message });
        }
    }

    // forgot password email send
    async forgotpassemailsend(req, res) {
        try {
            const v = new Validator(req.body, {
                email: "required|email",
            });
            const matched = await v.check();
            if (!matched) {
                // If validation fails, send errors to the client
                return res.status(errorCode.unauthorized).json({ message: v.errors });
            }
            const { email } = req.body
            const attendeeesistchack = await attendeeRepositories.existattendee(email)

            if (!attendeeesistchack) {
                return res.status(errorCode.forbidden).json({ message: "Wrong Email" });
            }
            const token = jwt.sign({
                _id: attendeeesistchack._id,
                first_name: attendeeesistchack.first_name,
                last_name: attendeeesistchack.last_name,
                phone: attendeeesistchack.phone,
                email: attendeeesistchack.email,
                age: attendeeesistchack.age,
                role: attendeeesistchack.role
            }, process.env.JWTSECRECT || 'WEBSKITTERPROJECTSDLCHILOKNLUIKD', { expiresIn: '15m' })

            const link = `${process.env.BACKEND_URL}/${token}`
            const emailinfo = await transporter.sendMail({
                from: `"Eventra" <${process.env.EMAIL_FROM}>`,
                to: email,
                subject: "Reset Your Password - Action Required",
                html: `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <title>Reset Your Password</title>
                            <style>
                            body {
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                background-color: #f6f9fc;
                                margin: 0;
                                padding: 0;
                                color: #333;
                            }
                            .container {
                                max-width: 600px;
                                margin: 40px auto;
                                background-color: #ffffff;
                                border-radius: 10px;
                                padding: 40px;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                            }
                            h2 {
                                color: #2c3e50;
                            }
                            p {
                                line-height: 1.6;
                            }
                            .button {
                                display: inline-block;
                                padding: 12px 25px;
                                background-color: #4CAF50;
                                color: #ffffff;
                                border-radius: 5px;
                                text-decoration: none;
                                font-weight: bold;
                                margin-top: 20px;
                            }
                            .footer {
                                text-align: center;
                                font-size: 12px;
                                color: #888;
                                margin-top: 40px;
                            }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                            <h2>Password Reset Request</h2>
                            <p>Hello <strong>${attendeeesistchack.first_name + " " + attendeeesistchack.last_name}</strong>,</p>
                            <p>We received a request to reset your password. Click the button below to set a new password for your account.</p>
                            <a href="${link}" class="button">Reset Password</a>
                            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                            <p>Note: This password reset link will expire in 15 minutes for your security.</p>
                            <div class="footer">
                                &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
                            </div>
                            </div>
                        </body>
                        </html>`, // html body
            })
            if (emailinfo) {
                return res.status(errorCode.success).json({
                    message: "Email Send successfully."
                });
            }
            return res.status(errorCode.forbidden).json({ message: "Email Not Send Error!!", });
        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }

    //Get Attendee List
    async getALLAttendeesList(req, res) {
        try {
            const attendeeList = await attendeeRepositories.getattendeelist();
            return res.status(errorCode.success).json({ message: "Attendee List", data: attendeeList });
        } catch (error) {
            console.log(error);
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }

    // forgot password update
    async forgotpassword(req, res) {
        try {

            const user = req.user;

            if (!user) {
                return res.status(errorCode.serverError).json({ message: "Not Authenticate attendee" });
            }
            const v = new Validator(req.body, {
                password: 'required|minLength:6',
                confirm_password: 'required|minLength:6|same:password'
            });
            // Validate inputs
            const matched = await v.check();

            if (!matched) {
                // If validation fails, send errors to the client
                return res.status(errorCode.unauthorized).json({ message: v.errors });
            }

            const { password, confirm_password } = req.body
            const hashedpassword = await hashpassword(password)
            const email = user.email

            const updata = await attendeeRepositories.updatedata(email, hashedpassword)

            if (updata) {
                return res.status(errorCode.success).json({
                    message: "Password updated successfully.",
                    success: true
                });
            }
        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }
    // change password update
    async changepassword(req, res) {
        try {

            const user = req.user;
            if (!user) {
                return res.status(errorCode.serverError).json({ message: "Not Authenticate attendee" });
            }
            const v = new Validator(req.body, {
                current_password: 'required|minLength:6',
                password: 'required|minLength:6',
                confirm_password: 'required|minLength:6|same:password'
            });
            // Validate inputs
            const matched = await v.check();

            if (!matched) {
                // If validation fails, send errors to the client
                return res.status(errorCode.unauthorized).json({ message: v.errors });
            }
            const email = user.email
            const { current_password, password, confirm_password } = req.body
            const existuser = await attendeeRepositories.existattendee(email)
            const passmatch = await bycript.compare(current_password, existuser.password);
            if (!passmatch) {
                return res.status(errorCode.forbidden).json({ message: "Your Current Password is Wrong" });
            }
            const hashedpassword = await hashpassword(password)


            const updata = await attendeeRepositories.updatedata(email, hashedpassword)

            if (updata) {
                return res.status(errorCode.success).json({
                    message: "Password Chnage successfully.",
                    success: true
                });
            }
            return res.status(errorCode.unauthorized).json({
                message: "Password Not Chnage Error Oucurred"
            });
        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }
    async deleteaccount(req, res) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(errorCode.serverError).json({ message: "Not Authenticate attendee" });
            }
            const v = new Validator(req.body, {
                email: 'required|email'
            })
            const matched = await v.check();

            if (!matched) {
                return res.status(400).json({ errors: v.errors });
            }
            const { email } = req.body
            const attendeeemail = user.email
            if (email !== attendeeemail) {
                return res.status(errorCode.forbidden).json({ message: "Invalid email" });
            }
            const attendeedata = await attendeeRepositories.existattendee(email)
            if (!attendeedata) {
                return res.status(errorCode.forbidden).json({ message: "Invalid email" });
            }
            if (attendeedata.isdelete) {
                return res.status(errorCode.forbidden).json({ message: "Your account already delete" });
            }
            const deletedata = await attendeeRepositories.deleteaccount(email)
            if (deletedata) {
                return res.status(errorCode.success).json({
                    message: "Account Delete successfully",
                    success: true
                });
            }
            return res.status(errorCode.unauthorized).json({
                message: "Account Not Delete Error Oucurred"
            });
        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }

    // user dashboard testimonial 
    async testimonial(req, res) {
        try {
            const id = req.params.id
            // Initialize Validator with the input validation rules
            const v = new Validator(req.body, {
                commentdata: 'required|string|minLength:3',
                rating: 'required|integer',
            });

            // Validate inputs
            const matched = await v.check();
            if (!matched) {
                // If validation fails, send errors to the client
                return res.status(errorCode.unauthorized).json({ message: v.errors });
            }
            const user = req.user
            if (!user) {
                return res.status(errorCode.forbidden).json({ message: "Not Authenticate user" });
            }
            const evdata = await eventRepositories.findbyid(id);
            if (!evdata) {
                return res.status(errorCode.forbidden).json({ message: "This Event Not Found" });

            }
            const { commentdata, rating } = req.body
            const data = { commentdata, rating, userid: user._id, event_id: id }
            const testimonial = await testimonialRepo.adddata(data)
            if (testimonial) {
                return res.status(errorCode.success).json({ message: 'Thank you for taking the time to rate us' });
            }
            return res.status(errorCode.forbidden).json({ message: "Server Error" });

        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }
    // user dashboard testimonial 
    async testimonialshow(req, res) {
        try {
            const id = req.params.id
            const user = req.user

            // const existdata = await testimonialRepo.testmonialfinf(id)
            // console.log(existdata);


            // if (existdata.isdelete) {
            //     return res.status(errorCode.forbidden).json({ message: "Message Not Found" });
            // }
            const evdata = await eventRepositories.findbyid(id);
            if (!evdata) {
                return res.status(errorCode.forbidden).json({ message: "This Event Not Found" });

            }
            const testimonial = await testimonialRepo.tesmonialshowdata(id)
            if (!testimonial) {
                return res.status(errorCode.success).json({ message: 'Testimonial not found', data: testimonial });
            }

            if (testimonial.length > 0) {
                return res.status(errorCode.success).json({ message: 'data fetch sycessfully', data: testimonial });
            }
            return res.status(errorCode.forbidden).json({ message: "No Testimonial Data Found" });

        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }
    async testimonialshowall(req, res) {
        try {

            const user = req.user

            // const existdata = await testimonialRepo.testmonialfinf(id)
            // console.log(existdata);


            // if (existdata.isdelete) {
            //     return res.status(errorCode.forbidden).json({ message: "Message Not Found" });
            // }

            const testimonial = await testimonialRepo.tesmonialshowdataall()



            if (testimonial) {
                return res.status(errorCode.success).json({ message: 'data fetch sycessfully', data: testimonial });
            }
            return res.status(errorCode.forbidden).json({ message: "No Testimonial Data Found" });

        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }
    async testimonialupdate(req, res) {
        try {
            const v = new Validator(req.body, {
                commentdata: 'required|string|minLength:3',
                rating: 'required|integer',
            });
            // Validate inputs
            const matched = await v.check();

            if (!matched) {
                // If validation fails, send errors to the client
                return res.status(errorCode.unauthorized).json({ message: v.errors });
            }


            const user = req.user
            const { commentdata, rating } = req.body
            const data = { commentdata, rating }
            if (!user) {
                return res.status(errorCode.forbidden).json({ message: "Not Authenticate user" });
            }
            const existdata = await testimonialRepo.testmonialfinf(id);

            if (!existdata) {
                return res.status(errorCode.forbidden).json({ message: "Testimonial  Not Found" });

            }
            if (existdata.isdelete) {
                return res.status(errorCode.forbidden).json({ message: "Testimonial Not Found" });
            }
            const testimonial = await testimonialRepo.tesmonialupdatedata(id, data)
            if (testimonial) {
                return res.status(errorCode.success).json({ message: 'Your Message Update Sucessfully' });
            }
            return res.status(errorCode.forbidden).json({ message: "Server Error" });

        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }
    async testimonialdelete(req, res) {
        try {
            const id = req.params.id
            const user = req.user
            if (!user) {
                return res.status(errorCode.forbidden).json({ message: "Not Authenticate user" });
            }
            const existdata = await testimonialRepo.testmonialfinf(id);

            if (!existdata) {
                return res.status(errorCode.forbidden).json({ message: "Testimonial  Not Found" });

            }
            const testimonial = await testimonialRepo.tesmonialdeletedata(id)


            if (testimonial) {
                return res.status(errorCode.success).json({ message: 'Your Message Delete Sucessfully' });
            }
            return res.status(errorCode.forbidden).json({ message: "Server Error" });

        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }

    async attendeeDashboard(req, res) {

        try {
            const user = req.user;
            console.log(user._id)
            if (!user.role == 'admin') {
                return res.status(errorCode.forbidden).json({ message: 'You are not an Attendee' });
            }
            const data = await attendeeRepositories.getUserDetails(user._id)
            if (data) {
                return res.status(errorCode.success).json({ message: 'Attendee Data fetched', data: data[0] });
            }
            return res.status(errorCode.forbidden).json({ message: 'No Attendee Data Found' });

        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }

    async updateAttendeeData(req, res) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(errorCode.forbidden).json({ message: 'Not Authenticate user' });
            }
            const { first_name, last_name, email, phone, dob, gender, about } = req.body
            if (req.file) {
                const image = req.file.path.replace(/\\/g, '/')
                const data = { first_name, last_name, email, phone, dob, gender, about, image, updatedAt: new Date() }
                const dataupdate = await attendeeRepositories.updateUserDetails(user._id, data)
                if (dataupdate) {
                    return res.status(errorCode.success).json({ message: 'Attendee Data Updated', data: dataupdate });
                }
                return res.status(errorCode.forbidden).json({ message: 'No Attendee Data Found' });
            }
            const data = { first_name, last_name, email, phone, dob, gender, about }
            const dataupdate = await attendeeRepositories.updateUserDetails(user._id, data)
            if (dataupdate) {
                return res.status(errorCode.success).json({ message: 'Attendee Data Updated', data: dataupdate });
            }
            return res.status(errorCode.forbidden).json({ message: 'No Attendee Data Found' });

        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }

    async getUserBookedTickets(req, res) {
        try {
            const userId = req.user._id;
            if (!userId) {
                return res.status(errorCode.forbidden).json({ message: 'Not Authenticate user' });
            }
            const userTicketList = await attendeeRepositories.getTicketListByUserId(userId);
            if (userTicketList) {
                return res.status(errorCode.success).json({ message: 'Ticket List fetched', data: userTicketList });
            }
            return res.status(errorCode.forbidden).json({ message: 'No Ticket List Found' });

        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }
}

module.exports = new attendeeController();