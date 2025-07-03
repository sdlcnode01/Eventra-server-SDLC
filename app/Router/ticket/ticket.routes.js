const express = require("express");
const routeLabel = require("route-label");
const ticketController = require("../../Module/Tickets/controller/Ticket.Controller");
const {authCheck} = require("../../Middleware/authCheck");


const router = express.Router();
const namedRouter = routeLabel(router);

// Create new ticket
namedRouter.post(
    "ticket.create",
    "/create",
    authCheck,
    ticketController.createTicket
);

//get all ticket list
namedRouter.get(
    "ticket.list",
    "/list",
    ticketController.getTicketList
);

//get ticket by id
namedRouter.get(
    "ticket.getById",
    "/getById/:id",
    authCheck,
    ticketController.getTicketById
);

//cancel ticket
namedRouter.post(
    "ticket.cancel",
    "/cancel/:id",
    authCheck,
    ticketController.cancelTicket
);

module.exports = router;