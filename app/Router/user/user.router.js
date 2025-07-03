const routeLabel = require("route-label");
const express = require('express')
const userController = require('../../Module/user/Controller/attendee.controller');
const uploadImage = require('../../Helper/uploadImage');
const {authCheck} = require("../../Middleware/authCheck");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router()
const namedRouter = routeLabel(router);

//get all attendee list
namedRouter.get("user.attendeelist", '/attendeelist', userController.getALLAttendeesList);
// user register
namedRouter.post("user.register", '/register', uploadImage.single('image'), userController.register);
// user login
namedRouter.post("user.login", '/login', userController.login);
// otp send
namedRouter.post("user.otpsend", '/otpsend', userController.otpsend);
// otp verify
namedRouter.post("user.otpverify", '/otpverify', userController.otpverify);
// user dashboard
namedRouter.get("user.dashboard", '/dashboard', authCheck, userController.attendeeDashboard);
// get user tickets booked
namedRouter.get("user.getuserbookedtickets", '/user-booked-tickets', authCheck, userController.getUserBookedTickets);
// Update Attendee Profile
namedRouter.post("user.profile-update", '/profile-update', uploadImage.single('image'), authCheck, userController.updateAttendeeData);
// fortgot password email send
namedRouter.post("user.forgotpasswordemail", '/forgorpassword-email-send', userController.forgotpassemailsend)
// forgot password update in datbase
namedRouter.post("user.forgotpassword", '/forgorpassword', authCheck, userController.forgotpassword)
// change password update in datbase
namedRouter.post("user.changepassword", '/changepassword', authCheck, userController.changepassword)
// Account Delete
namedRouter.post("user.deleteaccount", '/deleteaccount', authCheck, userController.deleteaccount)
// testimonial data store
namedRouter.post("user.testimonialdatstore", '/testimonialdatastore/:id', authCheck, userController.testimonial)

namedRouter.get("user.testimonialdatashow", '/testimonialdatashow/:id',  userController.testimonialshow)
namedRouter.get("user.testimonialdatashowall", '/testimonialalldata',  userController.testimonialshowall)
namedRouter.post("user.testimonialdataupdate", '/testimonialdataupdate/:id', authCheck, userController.testimonialupdate)
namedRouter.get("user.testimonialdatadelete", '/testimonialdatadelete/:id', authCheck, userController.testimonialdelete)

namedRouter.get("user.googleAuth", '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

namedRouter.get("user.googleCallback", '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    }, process.env.JWT_SECRECT || 'WEBSKITTERPROJECTSDLCHILOKNLUIKD', { expiresIn: '2h' });

    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

// Step 1: Start OAuth
// router.get("/auth/google", passport.authenticate("google", {
//     scope: ["profile", "email"]
//   }));

//   // Step 2: Google Redirects Here
//   router.get(
//     "/auth/google/callback",
//     passport.authenticate("google", {
//       failureRedirect: "/login",
//       session: true
//     }),
//     (req, res) => {
//       res.status(200).json({ message: "Google login successful", user: req.user });
//     }
//   );


module.exports = router