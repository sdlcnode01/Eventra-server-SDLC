const routeLabel = require("route-label");
const express = require('express')
const organizerController = require('../../Module/organizer/Controller/organizer.comtroller');
const userController = require('../../Module/user/Controller/attendee.controller');
const uploadImage = require('../../Helper/uploadImage');
const {authCheck} = require("../../Middleware/authCheck");
const router = express.Router()
const namedRouter = routeLabel(router);


// organizer register
namedRouter.post("organizer.register", '/register', uploadImage.single('image'), organizerController.register);
// user login
namedRouter.post("organizer.login", '/login', organizerController.login);
// otp send
namedRouter.post("organizer.otpsend", '/otpsend', userController.otpsend);
// otp verify
namedRouter.post("organizer.otpverify", '/otpverify', userController.otpverify);
// organizer dashboard
namedRouter.get("organizer.dashboard", '/dashboard', authCheck, organizerController.organizerDashboard);
// organizer list
namedRouter.get("organizer.eventlist", '/organizerlist', organizerController.getAllOrganizersList);
// organizer event list
namedRouter.get("organizer.eventlistbyorganizerid", '/event-list-by-organizer-id', authCheck, organizerController.getEventListByOrganizerId);
// fortgot password email send
namedRouter.post("organizer.forgotpasswordemail", '/forgorpassword-email-send', organizerController.forgotpassemailsend);
// forgot password update in datbase
namedRouter.post("organizer.forgotpassword", '/forgorpassword', authCheck, organizerController.forgotpassword);
// change password update in datbase
namedRouter.post("organizer.changepassword", '/changepassword', authCheck, organizerController.changepassword);
// Account Delete
namedRouter.post("organizer.deleteaccount", '/deleteaccount', authCheck, organizerController.deleteaccount);
// organizer image and about update
namedRouter.post("organizer.profile-update", '/profile-update', uploadImage.single('image'), authCheck, organizerController.organizerUpdate);


module.exports = router