const passport = require("passport");
const EventModel = require("../../Event/model/event.model");
const Organizer = require("../../user/Model/attendee.model");
const mongoose = require("mongoose");

class OrganizerRepositories {

  async getogranizerdetails(organizer_id) {
    try {
      const organizer = await Organizer.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(organizer_id),
            isdelete: false,
            role: 'organizer'
          }
        },
        {
          $project: {
            password: 0,
            __v: 0,
          }
        }
      ])
      console.log("organizer", organizer);
      return organizer
    } catch (err) {
      console.log(err);
    }
  }

  async getAllOrganizers() {
    try {
      const allOrganizersList = await Organizer.find({ isdelete: false, isActive: true, role: 'organizer' }).select({
        password: 0,
        __v: 0,
      }).lean();

      return allOrganizersList;
    } catch (error) {
      console.error("Error in getAllOrganizersList Repositories:", error);
    }
  }

  async updateOrganizerById(data, id) {
    try {
      const updatedOrganizer = await Organizer.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );
      return updatedOrganizer;
    } catch (error) {
      console.error("Error in updateOrganizerById:", error);
      throw error;
    }
  }

  async getOrganizerEventListById(organizerId) {
    try {
      const eventList = await EventModel.aggregate([
        {
          $match: {
            isDeleted: false,
            organizerId: new mongoose.Types.ObjectId(organizerId)
          }
        },
        {
          $lookup: {
            from: "tickets",               
            localField: "_id",             
            foreignField: "event_id",      
            as: "tickets_event"
          }
        }
      ]);

      return eventList;
    } catch (error) {
      console.error("Error in getEventListByOrganizerId:", error);
      throw error;
    }
  }
}


module.exports = new OrganizerRepositories();