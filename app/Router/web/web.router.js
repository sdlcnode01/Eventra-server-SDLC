const routeLabel = require("route-label");
const express = require('express')
const webController = require("../../webservices/web.Controller");
const router = express.Router()
const namedRouter = routeLabel(router);
const {authCheckView} = require("../../Middleware/authCheck");

// for home pages
// fetch populer event image
namedRouter.get("event.image", '/eventimages', webController.geteventimage);//
// display for search data
namedRouter.get("event.eventdataforsearch", '/eventdatadisplayforsearch', webController.eventshowdata);//
// after search get result
namedRouter.get("event.search", "/eventsearch", webController.eventsearch)// event serarch via rajex
// services datafetch
namedRouter.get("servicesdata.homepage", '/servicesdata', webController.servicesdata)//
// fetch artist image and name
namedRouter.get("event.artist", '/artistimageandname', webController.getartistimageandnameimage);//

// '''''''''fetch populer event image 
// testimonial events
namedRouter.get("event.Testimonial", '/testimonialdata', webController.testimonialdata);//

// // get populaerevents 8888888888
// namedRouter.get("event.populereventhome",'/homepopulerdata',webController.homepopulerdata);

// get organizer data
namedRouter.get("event.getorganizerdata", '/getorganizerdata', webController.getorganizerdata);//



// about
// get organizer data


// services
// // getsomeupcamingevents
// namedRouter.get("event.someupcamingevent",'/someupcomingeventsdata',webController.getupcamingevents);
// services data from home


// events
// presentevents
namedRouter.get("event.presentevent", '/presenteventsdata', webController.presenteventsdata);//
// gatallevents
namedRouter.get("event.upcomingevents", '/upcomingeventsdata', webController.getupcomingevents);//

namedRouter.get("event.GETALLcomingevents", '/getallevents', webController.allevents);//
// popular event from home "fetch event image"

// contact us
// contactus data store
namedRouter.post("contactus.router", '/contactusdatastore', webController.contactus);//

// for single event
namedRouter.get("singleevent.router", '/singleevent/:id', webController.singleevent);//


// for admin dashboard
namedRouter.get("admin.login.page","/admin/loginpage",webController.showLogin)
namedRouter.post("admin.loginview","/admin/loginview",webController.login)
namedRouter.get("admin.logout","/admin/logout",authCheckView,webController.adminLogout)
namedRouter.get("admin.index","/admin/admindashboard",authCheckView,webController.showHome)
namedRouter.get("admin.organizerlists","/admin/organizerlist",authCheckView,webController.organizerlists)
namedRouter.get("admin.organizerdetails","/admin/organizerdetails/:id",authCheckView,webController.organizerdetails)
namedRouter.get("admin.userlists","/admin/userlists",authCheckView,webController.userlists)
namedRouter.get("admin.userdetails","/admin/userdetails/:id",authCheckView,webController.userdetails)
namedRouter.get("admin.eventdetails","/admin/eventdetails",authCheckView,webController.eventdetails)

namedRouter.post("admin.organizer.deleteaccount", '/admin/user/deleteaccount/:id',authCheckView, webController.deleteByAdmin)




module.exports = router