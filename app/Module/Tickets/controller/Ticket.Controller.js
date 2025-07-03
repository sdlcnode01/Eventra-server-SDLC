const ticketRepository = require('../repositories/ticket.repositories');
const Attendee = require('../../user/Model/attendee.model');
const { v4: uuidv4 } = require('uuid');
const Event = require('../../Event/model/event.model');
const { errorCode } = require('../../../Helper/response');

class TicketController {
    async createTicket(req, res) {
        try {
            const { event_id, noOfTicketsBought } = req.body;

            const event = await Event.findOne({ _id: event_id });
            if (!event) {
                return res.status(errorCode.notFound).json({
                    status: errorCode.notFound,
                    message: 'Event not found'
                });
            }

            if (noOfTicketsBought > event.available_seats) {
                return res.status(errorCode.badRequest).json({
                    status: errorCode.badRequest,
                    message: `Only ${event.available_seats} seats left!`
                });
            }

            // Update event seats
            await Event.findByIdAndUpdate(
                event_id,
                {
                    $inc: {
                        booked_seats: noOfTicketsBought,
                        available_seats: -noOfTicketsBought
                    }
                }
            );

            const attendee = await Attendee.findOne({_id: req.user._id });
            console.log(attendee);
            if (!attendee) {
                return res.status(errorCode.notFound).json({
                    status: errorCode.notFound,
                    message: 'Attendee not found'
                });
            }

            const data = {
                e_ticket_id: uuidv4(),
                event_id,
                noOfTicketsBought,
                event_info: {
                    event_name: event.event_name,
                    event_location: {
                        venue: event.location.venue,
                        city: event.location.city
                    },
                    event_date: event.date,
                    price: event.ticketPrice
                },
                attendee_id: req.user._id,
                attendee_info: {
                    name: attendee.first_name + ' ' + attendee.last_name,
                    contact_info: {
                        phone: attendee.phone,
                        email: attendee.email
                    }
                },
                sold_by: event.organizerName,
                sold_at: new Date()
            };

            // console.log(data);
            const newTicket = await ticketRepository.createTicket(data);
            
            res.status(errorCode.success).json({
                status: errorCode.success,
                message: "Ticket created successfully",
                data: newTicket
            });

        } catch (error) {
            res.status(errorCode.serverError).json({
                status: errorCode.serverError,
                error: error.message,
                message: "Internal Server Error"
            });
            console.log(error);
        }
    }

    async getTicketList(req, res) {
        try {
            const tickets = await ticketRepository.getTicketList();
            res.status(errorCode.success).json({
                status: errorCode.success,
                message: "Tickets fetched successfully",
                data: tickets
            });
        } catch (error) {
            res.status(errorCode.serverError).json({
                status: errorCode.serverError,
                error: error.message,
                message: "Internal Server Error"
            });
            console.log(error);
        }
    }

    async getTicketById(req, res) {
        try{
            const ticketId = req.params.id;
            // console.log(ticketId);
            const ticket = await ticketRepository.getTicketById(ticketId);
            console.log(ticket);
            if (!ticket) {
                return res.status(errorCode.notFound).json({
                    status: errorCode.notFound,
                    message: "Ticket not found"
                });
            }
            res.status(errorCode.success).json({
                status: errorCode.success,
                message: "Ticket fetched successfully",
                data: ticket
            });
        } catch (error) {
            res.status(errorCode.serverError).json({
                status: errorCode.serverError,
                error: error.message,
                message: "Internal Server Error"
            });
            console.log(error);
        }
    }

    async cancelTicket(req, res) {
        try {
            const ticketId = req.params.id;
            const ticket = await ticketRepository.cancelTicket(ticketId);
            if (!ticket) {
                return res.status(errorCode.notFound).json({
                    status: errorCode.notFound,
                    message: "Ticket not found"
                });
            }
            res.status(errorCode.success).json({
                status: errorCode.success,
                message: "Ticket cancelled successfully",
                data: ticket
            });
        } catch (error) {
            res.status(errorCode.serverError).json({
                status: errorCode.serverError,
                error: error.message,
                message: "Internal Server Error"
            });
            console.log(error);
        }
    }

}

module.exports = new TicketController();