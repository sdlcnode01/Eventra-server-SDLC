const mongoose = require('mongoose');
const schema = mongoose.Schema;

const otpModel = new schema({

    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'attendees',
    },
    email: {
        type: String,
        required: [true, "All Field Is Required"]
    },
    otp: {
        type: Number,
        required: [true, "All Field Is Required"]
    },
    isotpsend: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 180  // seconds (3 minutes)
    }

}
)

const otpmodel = mongoose.model('otp', otpModel);
module.exports = otpmodel;