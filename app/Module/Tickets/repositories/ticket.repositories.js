const Ticket = require("../Model/ticket.model");


class TicketRepository {

    async createTicket(data) {
        try {
            const ticket = await Ticket.create(data);
            return ticket;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw { error };
        }
    }

    async getTicketList() {
        try {
            const tickets = await Ticket.find({ isCancelled: false }).lean();
            // console.log("Tickets fetched successfully from the repository layer", tickets);
            return tickets;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw { error };
        }
    }

    async getTicketById(ticketId) {
        try {
            const ticket = await Ticket.findById(ticketId).lean();
            // console.log("Ticket fetched successfully from the repository layer", ticket);
            if (!ticket) {
                throw new Error("Ticket not found");
            }
            return ticket;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw { error };
        }
    }

    async cancelTicket(ticketId) {
        try {
            const ticket = await Ticket.findByIdAndUpdate(ticketId, { isCancelled: true }, { new: true }).lean();
            if (!ticket) {
                throw new Error("Ticket not found");
            }
            return ticket;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw { error };
        }
    }
    async sssss(id) {
        try {
            const ticket = await Ticket.aggregate([
                {
                    $lookup:{
                        from:'tickets',
                        localField:'event_id',
                        foreignField:'_id'
                    }
                }
            ])
            if (!ticket) {
                throw new Error("Ticket not found");
            }
            return ticket;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw { error };
        }
    }
}

module.exports = new TicketRepository();