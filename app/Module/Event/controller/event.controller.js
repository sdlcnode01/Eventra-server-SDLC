// const deleteFile = require("../../../Helper/deleteFile");
const EventRepositories = require("../repositories/event.repositories");
const path = require("path");
const fs = require('fs');
const eventRepositories = require("../repositories/event.repositories");
const { errorCode } = require("../../../Helper/response");
const { eventValidationSchema, eventUpdateValidationSchema } = require("../validation/event.validation");
class EventController {
    async createEvent(req, res) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }


            const { error, value } = eventValidationSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            if (user.role !== 'organizer') {
                return res.status(400).json({ message: 'Only organizers can create events' });
            }


            const { event_name, description, date, time, type, total_seats, ticketPrice, validAge, artistname, artistrole, category, venue, city, online_link, status } = value;

            // const { venue, city } = location;

            const imagePaths = req.files?.images?.map((file) => file.filename) || [];
            const videoPaths = req.files?.videos?.map((file) => file.filename) || [];

            const organizer_id = user._id;
            // const userData = await attendeeModel.findById(user._id);
            const organizerName = user.company_name;

            const eventObj = {
                event_name,
                description,
                date,
                time,
                location: { venue: venue, city: city },
                type,
                // online_link,
                online_link: type === "online" ? online_link : null,
                total_seats,
                ticketPrice,
                validAge,
                artistname,
                artistrole,
                category,
                status,
                organizerId: organizer_id,
                organizerName: organizerName,
                booked_seats: 0,
                images: imagePaths,
                videos: videoPaths,
                available_seats: total_seats
            };

            const data = await EventRepositories.create(eventObj);

            if (data) {
                return res.status(201).json({
                    message: "Event created successfully",
                    event: data
                });
            } else {
                return res.status(400).json({
                    message: "Failed to create event"
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Internal Server Error",
                error,
            });
        }
    }

    async eventList(req, res) {
        try {

            let allData = await EventRepositories.find();
            console.log("allData ", allData);

            if (allData.length > 0) {
                return res.status(errorCode.success).json({
                    status: 200,
                    message: "data fetched successfully",
                    data: allData,
                });
            }
            return res.status(errorCode.notFound).json({
                status: 404,
                message: "data not found",
                data: {},
            });
        } catch (error) {
            return res.status(errorCode.internalServerError).json({
                status: 500,
                message: "Internal Server Error",
                error,
            });
        }
    }
    async editEvent(req, res) {
        try {
            const user = req.user;

            if (!user.role == 'organizer') {
                return res.status(errorCode.forbidden).json({ message: 'Only organizer Can Create Event' });
            }
            let id = req.params.id;
            console.log(id);

            let editData = await eventRepositories.edit(id);
            console.log("editData ", editData);

            if (editData) {
                return res.status(errorCode.success).json({
                    status: 200,
                    message: "data fetched successfully",
                    data: editData,
                });
            } else {
                return res.status(errorCode.notFound).json({
                    status: 404,
                    message: "data failed to fetched ",
                    data: {},
                });
            }
        } catch (error) {
            return res.status(errorCode.internalServerError).json({
                status: 500,
                message: "Internal Server Error",
                error,
            });
        }
    }
    
    async updateEvent(req, res) {
        try {
            const { error, value } = eventUpdateValidationSchema.validate(req.body, { allowUnknown: true, stripUnknown: true });
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const user = req.user;
            if (user.role !== 'organizer') {
                return res.status(403).json({ message: 'Only organizers can update events' });
            }

            const id = req.params.id;
            const existingEvent = await EventRepositories.edit(id);
            if (!existingEvent) {
                return res.status(404).json({ message: "Event not found" });
            }

            // Handle images
            let newImages = [];
            if (req.files?.images) {
                existingEvent.images?.forEach(imagePath => {
                    const filepath = path.join("uploads/images", imagePath);
                    fs.unlink(filepath, err => {
                        if (err) console.log(`Image deletion error: ${err}`);
                    });
                });
                newImages = req.files.images.map(file => file.filename);
            }

            // Handle videos
            let newVideos = [];
            if (req.files?.videos) {
                existingEvent.videos?.forEach(videoPath => {
                    const filepath = path.join("uploads/videos", videoPath);
                    fs.unlink(filepath, err => {
                        if (err) console.log(`Video deletion error: ${err}`);
                    });
                });
                newVideos = req.files.videos.map(file => file.filename);
            }


            const updatedEvent = {
                event_name: value.event_name ?? existingEvent.event_name,
                description: value.description ?? existingEvent.description,
                date: value.date ?? existingEvent.date,
                time: value.time ?? existingEvent.time,
                type: value.type ?? existingEvent.type,
                total_seats: value.total_seats ?? existingEvent.total_seats,
                ticketPrice: value.ticketPrice ?? existingEvent.ticketPrice,
                validAge: value.validAge ?? existingEvent.validAge,
                artistname: value.artistname ?? existingEvent.artistname,
                artistrole: value.artistrole ?? existingEvent.artistrole,
                category: value.category ?? existingEvent.category,
                location: {
                    venue: value.venue ?? value.location?.venue ?? existingEvent.location?.venue,
                    city: value.city ?? value.location?.city ?? existingEvent.location?.city,
                },
                online_link: (value.type ?? existingEvent.type) === "online"
                    ? (value.online_link ?? existingEvent.online_link)
                    : null,
                images: newImages.length > 0 ? newImages : existingEvent.images,
                videos: newVideos.length > 0 ? newVideos : existingEvent.videos,
            };

            const updatedData = await EventRepositories.update(id, updatedEvent);

            if (updatedData) {
                return res.status(200).json({
                    message: "Event updated successfully",
                    event: updatedData
                });
            } else {
                return res.status(400).json({
                    message: "Failed to update event"
                });
            }
        } catch (error) {
            console.error("Update Event Error:", error);
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message,
            });
        }
    }


    async deleteEvent(req, res) {
        try {
            const user = req.user;
            // console.log(user)
            if (!user.role == 'organizer') {
                return res.status(400).json({ message: 'Only organizer Can Create Event' });
            }
            let id = req.params.id;
            let existingEvent = await EventRepositories.edit(id);
            // console.log("existingEvent ", existingEvent);

            if (!existingEvent) {
                return res.json({
                    status: 404,
                    message: "Event not found",
                    data: {},
                });
            }
            if (existingEvent.length > 0) {

                existingEvent.images?.forEach(imagePath => {
                    const filepath = path.join("uploads/videos", imagePath)
                    fs.unlink(filepath, (err) => {
                        if (err) {
                            console.log(`Error deleting file: ${err}`);
                        } else {
                            console.log(`File deleted: ${filepath}`);
                        }
                    })

                });

                existingEvent.videos?.forEach(videoPath => {
                    const filepath = path.join("uploads/videos", videoPath)
                    fs.unlink(filepath, (err) => {
                        if (err) {
                            console.log(`Error deleting file: ${err}`);
                        } else {
                            console.log(`File deleted: ${filepath}`);
                        }
                    })

                });
            }


            let deletedData = await EventRepositories.delete(id);


            if (deletedData) {
                return res.json({
                    status: 200,
                    message: "data deleted successfully",
                    data: { id },
                });
            } else {
                return res.json({
                    status: 400,
                    message: "data failed to delete ",
                    data: {},
                });
            }
        } catch (error) {
            console.log(error)
            return res.json({
                status: 500,
                message: "Internal Server Error",
                error,
            });
        }
    }
}

module.exports = new EventController();
