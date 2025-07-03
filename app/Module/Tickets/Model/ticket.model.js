const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    e_ticket_id: {
        type: String,
        required: true,
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'event',
        required:true
    },
    noOfTicketsBought: {
        type: Number,
        required: true,
    },
    event_info: {
        event_name: {
            type: String,
            required: true,
        },
        event_location: {
            venue: { type: String, required: true },
            city: { type: String, required: true }
        },
        event_date: {
            type: Date,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        }
    },
    attendee_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    attendee_info: {
        name: {
            type: String,
            required: true
        },
        contact_info: {
            phone: {
                type: String,
            },
            email: {
                type: String,
            },
        }
    },
    sold_by: {
        type: String,
        required: true,
    },
    sold_at: {
        type: Date,
        default: Date.now,
    },
    isCancelled: {
        type: Boolean,
        default: false,
    },

})

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;