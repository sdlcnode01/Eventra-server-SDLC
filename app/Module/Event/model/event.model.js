const mongoose = require("mongoose");


const EventSchema = new mongoose.Schema(
    {
        event_name: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        location: {
            venue: { type: String, required: true },
            city: { type: String, required: true },
        },
        type: { type: String, enum: ["online", "offline"], required: true },
        online_link: { type: String},
        total_seats: { type: Number, required: true },
        booked_seats: { type: Number, default: 0 },
        available_seats: { type: Number },
        ticketPrice: { type: Number, required: true },
        category: {
            type: String,

        },
        status: {
            type: String,
            enum: ["upcoming", "completed", "cancelled", "live"],
            default: "upcoming",
        },
        organizerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "attendees",
        },
        organizerName: {
            type: String,
            require: ["true"]
        },
        artistname: {
            type: String,
            require: ["true"]
        },
        artistrole: {
            type: String,
            require: ["true"]
        },
        validAge: {
            type: Boolean,
            default: false
        },
        images: {
            type: [String],
            default: []
        },
        videos: {
            type: [String],
            default: []
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: false }
);
const EventModel = new mongoose.model("event", EventSchema);
module.exports = EventModel;
