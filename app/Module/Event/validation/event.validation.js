
const Joi = require("joi");

const eventValidationSchema = Joi.object({
    event_name: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    booked_seats: Joi.number().min(0).default(0),
    available_seats: Joi.number().min(0),
    date: Joi.date().required(),
    time: Joi.string().required(),
    location: Joi.object({
        venue: Joi.string().required(),
        city: Joi.string().required()
    }),
    venue: Joi.string(),
    city: Joi.string(),
    online_link: Joi.string().uri().optional(),
    type: Joi.string().valid("online", "offline").required(),
    total_seats: Joi.number().min(0).required(),
    ticketPrice: Joi.number().min(0).required(),
    category: Joi.string().required(), 
    organizerId: Joi.string().optional(),
    organizerName: Joi.string(),
    artistname: Joi.string().required(),
    artistrole: Joi.string().min(3).required(),
    validAge: Joi.boolean().default(false),
    status: Joi.string().valid("upcoming", "completed", "cancelled", "live").default("upcoming"),
    images: Joi.array().items(
        Joi.string().pattern(/\.(jpg|jpeg|png)$/i)
      ),
      
      videos: Joi.array().items(
        Joi.string().pattern(/\.(mp4|mkv|avi)$/i)
      ).default([]),      
    isDeleted: Joi.boolean().default(false),
});


const eventUpdateValidationSchema = Joi.object({
    event_name: Joi.string().min(3),
    description: Joi.string().min(3),
    date: Joi.date(),
    time: Joi.string(),
    location: Joi.object({
        venue: Joi.string(),
        city: Joi.string()
    }),
    venue: Joi.string(),
    city: Joi.string(),
    type: Joi.string().valid("online", "offline"),
    online_link: Joi.string().uri().optional(),
    total_seats: Joi.number().min(0),
    ticketPrice: Joi.number().min(0),
    category: Joi.string(), 
    artistname: Joi.string(),
    artistrole: Joi.string().min(3),
    validAge: Joi.boolean(),
    status: Joi.string().valid("upcoming", "completed", "cancelled", "live"),
    images: Joi.array().items(Joi.string().pattern(/\.(jpg|jpeg|png)$/i)),
    videos: Joi.array().items(Joi.string().pattern(/\.(mp4|mkv|avi)$/i))
});

module.exports = {
    eventValidationSchema,
    eventUpdateValidationSchema
};
