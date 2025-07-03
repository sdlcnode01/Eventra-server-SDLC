const { errorCode } = require("../Helper/response");
const adminRepo = require("../Module/admin/Repositories/admin.repo");
const eventRepositories = require("../Module/Event/repositories/event.repositories");
const attendeeRepositories = require("../Module/user/Repositories/attendee.repositories");
const contactRepositories = require("../Module/user/Repositories/contact.repositories");
const OrganizerRepositories = require("../Module/organizer/Repositories/organizer.repositories");

const { Validator } = require("node-input-validator");
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");

class webController {
    // home pages
    async geteventimage(req, res) {
        try {
            const imagesdata = await eventRepositories.findalleventimage();
            if (!imagesdata) {
                return res
                    .status(errorCode.badRequest)
                    .json({ message: "Image not found", images: null });
            }
            return res
                .status(errorCode.success)
                .json({
                    message: "images fetch sucessfully",
                    images: imagesdata,
                });
        } catch (err) {
            console.log(err);
        }
    }
    // getartistimageandnameimage
    async getartistimageandnameimage(req, res) {
        try {
            const artistdata =
                await eventRepositories.findallartistimageandname();
            if (!artistdata) {
                return res
                    .status(errorCode.badRequest)
                    .json({ message: "data not found", data: null });
            }
            return res
                .status(errorCode.success)
                .json({ message: "Data fetch sucessfully", data: artistdata });
        } catch (err) {
            console.log(err);
        }
    }

    // getupcamingevents
    async getupcomingevents(req, res) {
        try {
            const data = await eventRepositories.findallupcamingevents();
            if (!data) {
                return res
                    .status(errorCode.badRequest)
                    .json({ message: "data not found", data: null });
            }
            return res
                .status(errorCode.success)
                .json({ message: "Data fetch sucessfully", data: data });
        } catch (err) {
            console.log(err);
        }
    }
    // getupcamingevents
    async gatallevents(req, res) {
        try {
            const data = await eventRepositories.findallgatallevents();
            if (!data) {
                return res
                    .status(errorCode.badRequest)
                    .json({ message: "data not found", data: null });
            }
            return res
                .status(errorCode.success)
                .json({ message: "Data fetch sucessfully", data: data });
        } catch (err) {
            console.log(err);
        }
    }
    async allevents(req, res) {
        try {
            const data = await eventRepositories.findallevents();
            if (!data) {
                return res
                    .status(errorCode.badRequest)
                    .json({ message: "data not found", data: null });
            }
            return res
                .status(errorCode.success)
                .json({ message: "Data fetch sucessfully", data: data });
        } catch (err) {
            console.log(err);
        }
    }
    // presenteventsdata
    async presenteventsdata(req, res) {
        try {
            const data = await eventRepositories.presentevents();
            if (!data) {
                return res
                    .status(errorCode.badRequest)
                    .json({ message: "data not found", data: null });
            }
            return res
                .status(errorCode.success)
                .json({ message: "Data fetch sucessfully", data: data });
        } catch (err) {
            console.log(err);
        }
    }
    // homepopulerdata
    async homepopulerdata(req, res) {
        try {
            const data = await eventRepositories.homepopulerdatas();
            if (!data) {
                return res
                    .status(errorCode.badRequest)
                    .json({ message: "data not found", data: null });
            }
            return res
                .status(errorCode.success)
                .json({ message: "Data fetch sucessfully", data: data });
        } catch (err) {
            console.log(err);
        }
    }
    // getupcamingevents
    async getorganizerdata(req, res) {
        try {
            const data = await attendeeRepositories.getogranizerdetails();
            if (!data) {
                return res
                    .status(errorCode.badRequest)
                    .json({ message: "data not found", data: null });
            }
            return res
                .status(errorCode.success)
                .json({ message: "Data fetch sucessfully", data: data });
        } catch (err) {
            console.log(err);
        }
    }
    async eventshowdata(req, res) {
        try {
            const data = await eventRepositories.eventcatagoroandall();
            if (!data) {
                return res
                    .status(errorCode.badRequest)
                    .json({ message: "data not found", data: null });
            }
            return res
                .status(errorCode.success)
                .json({ message: "Data fetch sucessfully", data: data });
        } catch (err) {
            console.log(err);
        }
    }
    //eventsearch
    async eventsearch(req, res) {
        try {
            const { catagory, type, date, venue, artistname } = req.query;

            // Initialize an empty search filter object
            let searchFilter = { isDeleted: false }; // Exclude deleted events

            // Add category filter if provided
            if (catagory) {
                searchFilter.catagory = catagory; // Filter by category
            }

            // Add type filter if provided (online/offline)
            if (type) {
                searchFilter.type = type; // Filter by event type (online/offline)
            }

            // Add date filter if provided (events on or after the given date)
            if (date) {
                searchFilter.date = { $gte: new Date(date) }; // Filter by future events
            }
            if (artistname) {
                searchFilter.artistname = artistname; // Filter by future events
            }

            // Add city filter if provided (case-insensitive search)
            if (venue) {
                searchFilter["location.venue"] = {
                    $regex: venue,
                    $options: "i",
                }; // Regex search for city
            }
            const data = await eventRepositories.eventsearchdata(searchFilter);
            if (!data) {
                return res
                    .status(errorCode.badRequest)
                    .json({ message: "data not found", data: null });
            }
            return res
                .status(errorCode.success)
                .json({ message: "Data fetch sucessfully", data: data });
        } catch (err) {
            console.log(err);
        }
    }
    // contact us page
    async contactus(req, res) {
        try {
            // Initialize Validator with the input validation rules
            const v = new Validator(req.body, {
                first_name: "required|string|minLength:3|maxLength:30",
                last_name: "required|string|minLength:3|maxLength:30",
                email: "required|email",
                phone: "required|integer|minLength:10|maxLength:10",
                servicetype: "required|minLength:3|maxLength:30",
                message: "required|minLength:5",
            });

            // Validate inputs
            const matched = await v.check();

            if (!matched) {
                // If validation fails, send errors to the client
                return res
                    .status(errorCode.unauthorized)
                    .json({ message: v.errors });
            }
            const {
                first_name,
                last_name,
                email,
                phone,
                servicetype,
                message,
            } = req.body;

            const data = {
                first_name,
                last_name,
                email,
                phone,
                servicetype,
                message,
            };
            const contact = await contactRepositories.adddata(data);
            if (contact) {
                return res
                    .status(errorCode.success)
                    .json({
                        message:
                            "Thank you for contacting us! Our team will get in touch with you shortly",
                    });
            }

            return res
                .status(errorCode.notFound)
                .json({ message: "Error Please Try After Some Time" });
        } catch (error) {
            console.log(error);
            return res
                .status(errorCode.serverError)
                .json({ message: error.message, error });
        }
    }

    // servicesdata

    async servicesdata(req, res) {
        try {
            const data = await adminRepo.servicesdataall();
            if (!data) {
                return res
                    .status(errorCode.badRequest)
                    .json({ message: "data not found", data: null });
            }
            return res
                .status(errorCode.success)
                .json({ message: "Data fetch sucessfully", data: data });
        } catch (err) {
            console.log(err);
        }
    }
    // servicesdata

    async singleevent(req, res) {
        try {
            const id = req.params.id;
            const data = await eventRepositories.singleeventdata(id);
            if (!data) {
                return res
                    .status(errorCode.badRequest)
                    .json({ message: "data not found", data: null });
            }
            return res
                .status(errorCode.success)
                .json({ message: "Data fetch sucessfully", data: data });
        } catch (err) {
            console.log(err);
        }
    }
    async testimonialdata(req, res) {
        try {
            const id = req.params.id;
           
            const data = await attendeeRepositories.testimonialdataall();
            if (!data) {
                return res
                    .status(errorCode.badRequest)
                    .json({ message: "data not found", data: null });
            }
            return res
                .status(errorCode.success)
                .json({ message: "Data fetch sucessfully", data: data });
        } catch (err) {
            console.log(err);
        }
    }
    // admin ejs render part below
    async showLogin(req, res) {
        try {

            res.render("login");
        } catch (error) {
            throw error;
        }
    }
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
                req.flash("error_msg", "Invalid credentials.");
                return res.redirect("/admin/loginpage");
            }
            const { email, password } = req.body;

            const userexist = await attendeeRepositories.existattendee(email);

            if (!userexist) {
                // If validation fails, send errors to the client
                req.flash("error_msg", "Invalid email.");
                return res.redirect("/admin/loginpage");
            }
            if (userexist.isdelete) {
                req.flash("error_msg", "Account is deleted.");
                return res.redirect("/admin/loginpage");
            }
            const passwordchack = await bycript.compare(
                password,
                userexist.password
            );
            if (!passwordchack) {
                req.flash("error_msg", "Invalid password.");
                return res.redirect("/admin/loginpage");
            }
            if (userexist.role !== "admin") {
                req.flash("error_msg", "Only admins can log in.");
                return res.redirect("/admin/login");
            }
            if (userexist.role == "admin") {
                const token = jwt.sign(
                    {
                        _id: userexist._id,
                        first_name: userexist.first_name,
                        last_name: userexist.last_name,
                        phone: userexist.phone,
                        email: userexist.email,
                        role: userexist.role,
                    },
                    process.env.JWTSECRECT ||
                        "WEBSKITTERPROJECTSDLCHILOKNLUIKD",
                    { expiresIn: "2h" }
                );

                res.cookie("token", token, {
                    maxAge: 7200000,
                    httpOnly: true,
                    path: "/admin",
                });

                req.flash("success_msg", "Login successful.");
                return res.redirect("/admin/admindashboard");
            }
        } catch (error) {
            console.log(error);
            res.clearCookie("token"); // Clear the incorrect cookie name
            req.flash("error_msg", "An error occurred during login.");
            return res.redirect("/admin/loginpage");
        }
    }

    async showHome(req, res) {
        if (!req.user || req.user.role !== "admin") {
            req.flash(
                "error_msg",
                "Access denied. Only admins can view this page."
            );
            return res.redirect("/admin/loginpage");
        }
        try {
            res.render("index");
        } catch (error) {
            throw error;
        }
    }
    async organizerlists(req, res) {
        try {
            const organizerlists =
                await OrganizerRepositories.getAllOrganizers();

            res.render("organizerlists", { organizerlists });
        } catch (error) {
            throw error;
        }
    }
    async organizerdetails(req, res) {
        try {
            const organizer_id = req.params.id;

            const data = await OrganizerRepositories.getogranizerdetails(
                organizer_id
            );
            const organizerData = data.length > 0 ? data[0] : {};

            res.render("organizerdetails", { organizerData });
        } catch (error) {
            throw error;
        }
    }
    async userlists(req, res) {
        try {
            const userlists = await attendeeRepositories.getattendeelist();

            res.render("userlists", { userlists });
        } catch (error) {
            throw error;
        }
    }
    async userdetails(req, res) {
        try {
            const user_id = req.params.id;

            const data = await attendeeRepositories.getUserDetails(user_id);
            const userData = data.length > 0 ? data[0] : {};

            res.render("userdetails", { userData });
        } catch (error) {
            throw error;
        }
    }
    async eventdetails(req, res) {
        try {
            res.render("eventdetails");
        } catch (error) {
            throw error;
        }
    }

    async deleteByAdmin(req, res) {
        try {
            const id = req.params.id;
            const { admin_msg } = req.body;

            const user = await attendeeRepositories.getUserDetails(id);
            const userData = user.length > 0 ? user[0] : {};

            if (userData.role === "attendee") {
                res.redirect("/admin/userlists");
            } else {
                res.redirect("/admin/organizerlist");
            }
            await attendeeRepositories.admindeleteaccount(id, admin_msg);
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    }
    async adminLogout(req, res) {
        try {
            res.clearCookie("token", {
                path: "/admin",
                httpOnly: true,
            });
            return res.redirect("/admin/loginpage");
        } catch (error) {
            console.error("Logout error:", error);
            return res.redirect("/admin/admindashboard"); // Fallback if something fails
        }
    }
}

module.exports = new webController();
