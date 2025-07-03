const Ticket = require('../../Tickets/Model/ticket.model');
const attendeeModel = require('../Model/attendee.model');
const otpModel = require('../Model/attendee.otpmodel');
const testimonial = require('../Model/testimonial.model');
const mongoose = require('mongoose');

class attendeeRepositories {
  // data add in mongodb
  async adddata(data) {
    try {

      const attendeedata = await attendeeModel.create(data)

      return attendeedata;
    } catch (err) {
      console.log(err);
    }

  }
  // exist attendee check

  async existattendee(email) {
    try {
      const attendeefind = await attendeeModel.findOne({ email });
      return attendeefind;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  //Reactivate account
  async reactivateAccount(email) {
    try {
      const reactivate = await attendeeModel.findOneAndUpdate({ email }, { isdelete: false });
      return reactivate;
    } catch (err) {
      console.log(err);
    }
  }
  //Reactivate account
  async adminreactivateAccount(id) {
    try {
      const reactivate = await attendeeModel.findByIdAndUpdate(id,{
        isadmindelete:false
      })
      return reactivate;
    } catch (err) {
      console.log(err);
    }
  }


  // findby id and update
  async findbyemail(data, email) {
    try {
       
      const { first_name, last_name, email, phone, dob, gender, password } = data
      const updata = await attendeeModel.findOneAndUpdate({ email: email }, {
        first_name, last_name, email, phone, dob, gender, password, isdelete: false
      })
      return updata
    } catch (err) {
      console.log(err)
    }
  }
  async organizerrefreshaccount(data, email) {
    try {
       
      const { company_name, email,phone, password, image} = data
      const updata = await attendeeModel.findOneAndUpdate({ email: email }, {
       company_name, email,phone, password, image, isdelete: false
      })
      return updata
    } catch (err) {
      console.log(err)
    }
  }

  //get all attendee list 

  async getattendeelist() {
    try {
      const attendeeList = await attendeeModel.find({ isdelete: false, role: 'attendee' }).select({
        first_name: 1,
        last_name: 1,
        email: 1,
        phone: 1,
        dob: 1,
        gender: 1,
        image: 1,
        about: 1,
        role: 1,
        createdAt : 1
      }).sort({ createdAt: -1 }).lean();

      return attendeeList;
    } catch (err) {
      console.log(err)
    }
  }

  // findby id and update
  async updateUserDetails(data, id) {
    try {
      const UpdateData = await attendeeModel.findByIdAndUpdate(id, {
        $set: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          dob: data.dob,
          gender: data.gender,
          image: data.image,
          about: data.about
        }
      },
      { new: true }
    );
      return UpdateData
    } catch (err) {
      console.log(err)
    }
  }
  // verify status chack
  async verify(email) {
    try {
      const attendeedata = await attendeeModel.findOneAndUpdate(
        { email }, // Search condition
        {
          $set: {
            isverify: true
          }
        },
        {
          new: true // Return the updated document
        }
      );

    } catch (err) {
      console.log(err);
    }
  }
  // update password data
  async updatedata(email, hashedpassword) {
    try {
      console.log(email, hashedpassword)
      const attendeedata = await attendeeModel.findOneAndUpdate(
        { email }, // Search condition
        {
          $set: {
            password: hashedpassword
          }
        },
        {
          new: true // Return the updated document
        }
      );

      return attendeedata;
    } catch (err) {
      console.log(err);
    }
  }
  // update password data
  async findbyid(id) {
    try {
     
      const attendeedata = await attendeeModel.findById(id);

      return attendeedata;
    } catch (err) {
      console.log(err);
    }
  }
  
  // deleteaccount

  async deleteaccount(email) {
    try {

      const attendeedata = await attendeeModel.findOneAndUpdate(
        { email }, // Search condition
        {
          $set: {
            isdelete: true
          }
        },
        {
          new: true // Return the updated document
        }
      );

      return attendeedata;
    } catch (err) {
      console.log(err);
    }
  }
  async admindeleteaccount(id,admin_msg) {
    try {

      const attendeedata = await attendeeModel.findByIdAndUpdate(id,{
        isdelete : true,
        isadmindelete:true,admin_msg:admin_msg
      })

      return attendeedata;
    } catch (err) {
      console.log(err);
    }
  }

  // otp send chack in otp model
  async otpdatafind(email) {
    try {
      const attendeedata = await otpModel.findOne({ email: email })
      return attendeedata;
    } catch (err) {
      console.log(err);
    }
  }
  // otp save in otp model
  async otpsave(data) {
    try {
      const { email, otp } = data
      const gg = await new otpModel({
        email, otp, isotpsend: true
      })
      await gg.save()
      return gg;
    } catch (err) {
      console.log(err);
    }
  }
  // delete data in otp model
  async otpdatadelete(id) {
    try {
      
      const data=await otpModel.findByIdAndDelete(id);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
  // delete data in otp model
  async getogranizerdetails() {
    try {
      
      const data=await attendeeModel.find({ isdelete: false,role:"organizer"});
      return data;
    } catch (err) {
      console.log(err);
    }
  }
  // delete data in otp model

  async testimonialdataall() {
    try {
      const testimonialdata = await testimonial.aggregate([
        {
          $match: {
            isdelete: false
          }
        },
        {
          $lookup: {
            from: "attendees",
            localField: "userid",
            foreignField: "_id",
            as: "usertestimonial"
          }
        }, {
          $unwind: "$usertestimonial"
        },
        {
          $project: {
            commentdata: "$commentdata",
            rating: "$rating",
            user_first_name: "$usertestimonial.first_name",
            user_last_name: "$usertestimonial.last_name",
            user_image: "$usertestimonial.image",
            user_email: "$usertestimonial.email",
          }
        }
      ])
      return testimonialdata
    } catch (err) {
      console.log(err);
    }
  }

  async getUserDetails(id) {
    try {
      const userData = await attendeeModel.aggregate([
        {
          $match: {
            isdelete: false,
            _id: new mongoose.Types.ObjectId(id)
          }
        },
        {
          $project: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            image: 1,
            email: 1,
            phone: 1,
            dob: 1,
            gender: 1,
            about: 1,
            role: 1,
            image: 1,
            createdAt : 1
          }
        }
      ])
      return userData
    } catch (err) {
      console.log(err);
    }
  }

  async getTicketListByUserId(userId) {
    try {
      const tickets = await Ticket.find({ attendee_id: userId });
      return tickets
    }catch (err) {
      console.log(err);
    }
  }

}



module.exports = new attendeeRepositories()