const routeLabel = require("route-label");
const express=require('express')
const uploadImage = require('../../Helper/uploadImage');
const adminComtroller = require("../../Module/admin/Controller/admin.comtroller");
const {authCheck} = require("../../Middleware/authCheck");
const router=express.Router()
const namedRouter = routeLabel(router);



// admin login
namedRouter.post("admin.login",'/login',adminComtroller.login);

// services add
namedRouter.post("addservicesorcatagory",'/servicescatagoryadd',uploadImage.single("images"),authCheck,adminComtroller.createserviceandcatagory)

// Account Delete
namedRouter.post("admin.user.deleteaccount", '/deleteaccount/id', authCheck, adminComtroller.admindeleteaccount)
namedRouter.post("admin.user.retriveccount", '/accountretrive/id', authCheck, adminComtroller.adminaccountretrive)
// Event Delete
namedRouter.post("admin.user.deleteaevent", '/deleteevent/id', authCheck, adminComtroller.admindeleteevent)
namedRouter.post("admin.user.retriveevent", '/eventretrive/id', authCheck, adminComtroller.admineventretrive)


module.exports=router