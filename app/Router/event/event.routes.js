const express = require("express");
const routeLabel = require("route-label");
const EventController = require("../../Module/Event/controller/event.controller");
const router = express.Router();
const namedRouter = routeLabel(router);
const {authCheck} = require("../../Middleware/authCheck");
const uploadImage = require("../../Helper/uploadImage");

// create event
namedRouter.post("event.create", "/create", 
    uploadImage.fields([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 }
    ]), 
    authCheck, 
    EventController.createEvent
);


namedRouter.get("event.list", "/list", EventController.eventList);

namedRouter.get("event.edit.id", "/edit/:id",authCheck, EventController.editEvent);
namedRouter.put(
    "event.update.id",
    "/update/:id",
    uploadImage.fields([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 }
    ]),
    authCheck,EventController.updateEvent
);

namedRouter.get(
    "event.delete.id",
    "/delete/:id",authCheck,
    EventController.deleteEvent
);

module.exports = router;
