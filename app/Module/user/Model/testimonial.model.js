const mongoose = require('mongoose');
const schema = mongoose.Schema;

const testimonialModel = new schema({

    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'attendees',  
       
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',  
       
    },
    commentdata: {
        type: String,
        required: [true, "All Field Is Required"]
    },
    rating: {
        type: Number,
        required: [true, "All Field Is Required"]
    },
    isdelete:{
        type:Boolean,
        default:false
    },
    isverify:{
        type:Boolean,
        default:false
    }
},
    {
        timestamps: true
    })

const testimonial = mongoose.model('testimonial', testimonialModel);
module.exports = testimonial;