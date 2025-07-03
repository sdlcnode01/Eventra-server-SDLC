const { default: mongoose } = require("mongoose");
const testimonial = require("../Model/testimonial.model");


class testimonialrepo {
    async adddata(data) {
        try {

            const contactdata = await testimonial.create(data)

            return contactdata;
        } catch (err) {
            console.log(err);
        }
    }
    async tesmonialshowdata(id) {
        try {

            const contactdata = await testimonial.aggregate([
                {
                    $match: {
                        event_id: new mongoose.Types.ObjectId(id),
                        isdelete: false
                    }
                }, {
                    $lookup: {
                        from: 'attendees',
                        localField: 'userid',
                        foreignField: '_id',
                        as: 'testimonial_user'

                    }
                }
            ])


            return contactdata;
        } catch (err) {
            console.log(err);
        }
    }
    async testmonialfinf(id) {
        try {

            const deletetest=await testimonial.findById(id)
            // const deletetest = await testimonial.aggregate([
            //     {
            //         $match: {
            //             _id: new mongoose.Types.ObjectId(id),

            //         },
            //     }, {

            //         $lookup: {
            //             from: 'attendees',
            //             localField: 'userid',
            //             foreignField: '_id',
            //             as: 'testimonial_user'

            //         }

            //     }
            // ])
            return deletetest;
        } catch (err) {
            console.log(err);
        }
    }
    async tesmonialupdatedata(id, data) {
        try {

            const { commentdata, rating } = data
            const deletetest = await testimonial.findById(id)
            if (deletetest.isdelete) {
                return
            }
            const contactdata = await testimonial.findByIdAndUpdate(id, {
                commentdata, rating
            })

            return contactdata;
        } catch (err) {
            console.log(err);
        }
    }
    async tesmonialdeletedata(id) {
        try {
            const contactdata = await testimonial.findByIdAndUpdate(id, {
                isdelete: true
            })

            return contactdata;
        } catch (err) {
            console.log(err);
        }
    }
    async tesmonialshowdataall() {
        try {
            const contactdata = await testimonial.find({ isdelete: false })

            return contactdata;
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = new testimonialrepo()