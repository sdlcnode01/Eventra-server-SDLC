const mongoose = require("mongoose");

const ServicesSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },        
        images: {
            type: String,
            default : [true]
        }, 
        type: { type: String, enum: ["services", "catacategories"], required: true },     
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: false }
);
const servicesModel = new mongoose.model("services", ServicesSchema);
module.exports = servicesModel;
