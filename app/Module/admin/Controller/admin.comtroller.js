const { Validator } = require('node-input-validator');
const { errorCode } = require('../../../Helper/response');
const userRepositories = require('../../../Module/user/Repositories/attendee.repositories')
const bycript = require('bcryptjs');
const adminRepo = require('../Repositories/admin.repo');
const jwt = require('jsonwebtoken');
const attendeeRepositories = require('../../../Module/user/Repositories/attendee.repositories');
const transporter = require('../../../Config/emailConfig');
const eventRepositories = require('../../Event/repositories/event.repositories');
class adminController {
    // admin login
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

            const userexist = await userRepositories.existattendee(email)

            if (!userexist) {
                // If validation fails, send errors to the client
                return res.status(errorCode.forbidden).json({ message: "Invalid email" });
            }
            if (userexist.isdelete) {
                return res.status(errorCode.forbidden).json({ message: "Email Not Found" });
            }
            const passwordchack = await bycript.compare(password, userexist.password)
            if (!passwordchack) {
                return res.status(errorCode.forbidden).json({ message: 'Invalid password' });
            }
            if (userexist.role == 'admin') {
                const token = jwt.sign({
                    _id: userexist._id,
                    first_name: userexist.first_name,
                    last_name: userexist.last_name,
                    phone: userexist.phone,
                    email: userexist.email,
                    role: userexist.role
                }, process.env.JWTSECRECT || 'WEBSKITTERPROJECTSDLCHILOKNLUIKD', { expiresIn: '2h' })

                res.cookie('admintoken', token, { maxAge: 7200000, httpOnly: true })

                return res.status(errorCode.success).json({ message: 'Login successful', token: token });
            }
            return res.status(errorCode.forbidden).json({ message: 'Only Admin Can Login' });

        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }
    async createserviceandcatagory(req, res) {
        try {
            const v = new Validator(req.body, {
                name: "required|minLength:4",
                description: "required|minLength:6",
                type: "required|minLength:6|in:services,catacategories"
            });
            const matched = await v.check();
            if (!matched) {
                // If validation fails, send errors to the client
                return res.status(errorCode.unauthorized).json({ message: v.errors });
            }
            const user = req.user;
            if (!user.role == 'admin') {
                return res.status(errorCode.forbidden).json({ message: 'Please Login' });
            }
            const { name, description, type } = req.body
            const imagePaths = req.file.path;
            console.log(imagePaths)
            const eventObj = {
                name,
                type,
                description,
                images: imagePaths,
            };
            const data = await adminRepo.create(eventObj)
            if (data) {
                return res.status(errorCode.success).json({ message: 'Create Sucessfully' });
            }
            return res.status(errorCode.forbidden).json({ message: 'Only Admin Can Login' });

        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }

    async adminDashboard(req, res) {

        try {
            const user = req.user;
            console.log(user._id)
            if (!user.role == 'admin') {
                return res.status(errorCode.forbidden).json({ message: 'You are not the Admin' });
            }
            const data = await userRepo.getUserDetails(user._id)
            if (data) {
                return res.status(errorCode.success).json({ message: 'Admin Data fetched', data: data[0] });
            }
            return res.status(errorCode.forbidden).json({ message: 'No Admin Data Found' });

        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }
    async admindeleteaccount(req, res) {

        try {       const user=req.user
                   const id=req.params.id
                   if (!user) {
                       return res.status(errorCode.serverError).json({ message: "Not Authenticate admin" });
                   }
                   const{admin_msg}=req.body
                   const attendeedata=attendeeRepositories.findbyid(id)
                   if (attendeedata.isadmindelete) {
                       return res.status(errorCode.forbidden).json({ message: "Account already delete" ,admin_msg:attendeedata.admin_msg });
                   }
                   const deletedata = await attendeeRepositories.admindeleteaccount(id,admin_msg)
                   if (deletedata) {
                    const atten=attendeeRepositories.findbyid(id)
                    const emailinfo = await transporter.sendMail({
                        from: `eventra${process.env.EMAIL_FROM}`, // sender address
                        to: atten.email, // list of receivers
                        subject: "Account Deletion Notification", // Subject line
                        html: ` <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 40px;">
                                <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <h2 style="color: #d32f2f; border-bottom: 1px solid #eee; padding-bottom: 10px;">Account Deletion Notice</h2>
                                <p>Dear <strong>${atten.first_name}</strong>,</p>
                                <p>We are writing to inform you that your account has been <strong>permanently deleted</strong> due to a violation of our platform policies.</p>
                                <p><strong>Reason:</strong> ${atten.admin_msg}</p>
                                <p>This decision was made after a thorough investigation and in accordance with our <a href="#" style="color: #1976d2; text-decoration: none;">Community Guidelines</a>.</p>
                                <p>If you believe this action was taken in error, you may contact our support team within 7 days to appeal the decision.</p>
                                <br>
                                <p style="color: #555;">Sincerely,<br>
                                <strong>eventra</strong><br>
                                Support Team</p>
                                </div>
                            </div>` // html body
                    })
                    if(emailinfo){
                        return res.status(errorCode.success).json({
                            message: "Account Delete successfully",
                            success: true
                        });
                    }
                       
                   }
                   return res.status(errorCode.unauthorized).json({
                       message: "Account Not Delete Error Oucurred"
                   });
               } catch (error) {
                   console.log(error)
                   return res.status(errorCode.serverError).json({ message: error.message, error });
               }
    }
    async adminaccountretrive(req, res) {

        try {       const user=req.user
                   const id=req.params.id
                   if (!user) {
                       return res.status(errorCode.serverError).json({ message: "Not Authenticate admin" });
                   }
                   const attendeedata=attendeeRepositories.findbyid(id)
                   if (!attendeedata.isadmindelete) {
                       return res.status(errorCode.forbidden).json({ message: "Account Not delete" });
                   }
                 const retriveaccount=attendeeRepositories.adminreactivateAccount(id);
                   if (retriveaccount) {
                       return res.status(errorCode.success).json({
                           message: "Account Retrive successfully",
                           success: true
                       });
                   }
                   return res.status(errorCode.unauthorized).json({
                       message: "Account Not retrive Error Oucurred"
                   });
               } catch (error) {
                   console.log(error)
                   return res.status(errorCode.serverError).json({ message: error.message, error });
               }
    }
    async admindeleteevent(req, res) {

        try {       
            const user=req.user
            const id=req.params.id
            if (!user) {
                return res.status(errorCode.serverError).json({ message: "Not Authenticate admin" });
            }
            const{admin_msg}=req.body
            const attendeedata=eventRepositories.findbyid(id)
            if (attendeedata.isadmindelete) {
                return res.status(errorCode.forbidden).json({ message: "Event already delete" ,admin_msg:attendeedata.admin_msg });
            }
            const deletedata = await eventRepositories.admindeleteevent(id,admin_msg)
            if (deletedata) {
             const atten=eventRepositories.findbyid(id)
             const us=attendeeRepositories.findbyid(id)
             const emailinfo = await transporter.sendMail({
                 from: `eventra${process.env.EMAIL_FROM}`, // sender address
                 to: atten.email, // list of receivers
                 subject: `Warning: Event "${atten.event_name}" Deleted Due to Policy Violation `, // Subject line
                 html: ` <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 40px;">
                        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h2 style="color: #e53935; border-bottom: 1px solid #eee; padding-bottom: 10px;">Event Deletion & Warning Notice</h2>
                        <p>Dear <strong>${us.first_name}</strong>,</p>
                        <p>We want to inform you that your event titled <strong>"${atten.event_name}"</strong> has been <strong>removed</strong> from our platform.</p>
                        <p><strong>Reason for deletion:</strong> ${atten.admin_msg}</p>
                        <p>This action was taken due to a violation of our <a href="#" style="color: #1976d2;">Community Guidelines</a>. Please note that repeated violations may result in further actions, including temporary or permanent suspension of your account.</p>
                        <p>We encourage you to review our guidelines carefully before creating future events.</p>
                        <p>If you believe this was an error, you may contact our support team to appeal this decision.</p>
                        <br>
                        <p style="color: #555;">Thank you for your attention,<br>
                        <strong>Eventra</strong><br>
                        Events Compliance Team</p>
                        </div>
                        </div>` // html body
             })
             if(emailinfo){
                 return res.status(errorCode.success).json({
                     message: "Event  Delete successfully",
                     success: true
                 });
             }
                
            }
            return res.status(errorCode.unauthorized).json({
                message: "Event Not Delete Error Oucurred"
            });
        } catch (error) {
            console.log(error)
            return res.status(errorCode.serverError).json({ message: error.message, error });
        }
    }
    async admineventretrive(req, res) {

        try {       const user=req.user
                   const id=req.params.id
                   if (!user) {
                       return res.status(errorCode.serverError).json({ message: "Not Authenticate admin" });
                   }
                   const attendeedata=eventRepositories.findbyid(id)
                   if (!attendeedata.isadmindelete) {
                       return res.status(errorCode.forbidden).json({ message: "Event Not delete" });
                   }
                 const retriveaccount=eventRepositories.adminretriveevent(id);
                   if (retriveaccount) {
                       return res.status(errorCode.success).json({
                           message: "Event Retrive successfully",
                           success: true
                       });
                   }
                   return res.status(errorCode.unauthorized).json({
                       message: "Event Not retrive Error Oucurred"
                   });
               } catch (error) {
                   console.log(error)
                   return res.status(errorCode.serverError).json({ message: error.message, error });
               }
    }
}
module.exports = new adminController();