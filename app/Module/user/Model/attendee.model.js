const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Joi = require('joi');

// Organizer Validation Schema
const organizerSchema = Joi.object({
  company_name: Joi.string().required(),
  company_info: Joi.string().optional(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be exactly 10 digits.'
  }),
  password: Joi.string(),
  image: Joi.string().optional().allow(''),
  role: Joi.string().valid('organizer').required()
});

// Attendee Validation Schema
const attendeeSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  about: Joi.string().optional().allow(''),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be exactly 10 digits.'
  }),
  password: Joi.string(),
//   image: Joi.string().optional().allow(''),
//   role: Joi.string().default('attendee').optional(),
  gender: Joi.string().optional().allow(''),
  dob: Joi.date().required(),
  about: Joi.string().optional().allow(''),
});

const attendeeModel = new schema({

    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    company_name: {
        type: String,
    },
    company_info: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "All Field Is Required"]
    },
    phone: {
        type: Number,
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        default: 'attendee',
        enum: ['attendee', 'organizer', 'admin'],
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer not to say']
    },
    dob: {
        type: Date
    },
    password: {
        type: String,
        required: [true, "All Field Is Required"]
    },
    about: {
        type: String,
    },
    isdelete:{
        type:Boolean,
        default:false
    },
    isThirteenPlus:{
        type:Boolean,
        default:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isadmindelete:{
        type:Boolean,
        default:false
    },
    admin_msg:{
        type:String,
        default:''
    },
    isverify:{
        type:Boolean,
        default:false
    }
},
    {
        timestamps: true
    })

const attendee = mongoose.model('attendee', attendeeModel);
module.exports = attendee;
module.exports.organizerSchema = organizerSchema;
module.exports.attendeeSchema = attendeeSchema;