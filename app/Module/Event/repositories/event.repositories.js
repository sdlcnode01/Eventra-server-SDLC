const EventModel = require("../model/event.model");

class EventRepositories {
    async create(data) {
        try {
            let savedData = await EventModel.create(data);
           

            return savedData;
        } catch (error) {
            throw error;
        }
    }
    async find() {
        try {
            let allData = await EventModel.find().lean();
            return allData;
        } catch (error) {
            throw error;
        }
    }
    async findbyid(id) {
        try {
            let allData = await EventModel.findById(id)
            return allData;
        } catch (error) {
            throw error;
        }
    }
    async admindeleteevent(id,admin_msg) {
        try {
    
          const attendeedata = await EventModel.findByIdAndUpdate(id,{
            isadmindelete:true,admin_msg:admin_msg
          })
    
          return attendeedata;
        } catch (err) {
          console.log(err);
        }
      }
    async adminretriveevent(id) {
        try {
    
          const attendeedata = await EventModel.findByIdAndUpdate(id,{
            isadmindelete:false
          })
    
          return attendeedata;
        } catch (err) {
          console.log(err);
        }
      }
    async edit(id) {
        try {
            let editdata = await EventModel.findOne({
                _id: id,
                isDeleted: false,
            });
            return editdata;
        } catch (error) {
            throw error;
        }
    }
    async update(id, data) {
    try {
        const updatedData = await EventModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: data },
            { new: true }
        );
        return updatedData;
    } catch (error) {
        throw error;
    }
}
    async findalleventimage() {
        try {
           const images=await EventModel.aggregate([
            {
                $match:{
                    isDeleted: false
                }
            },
            {
                $project:{
                    _id:1,
                    images:1,
                }
            }
           ])
           return images;
        } catch (error) {
            throw error;
        }
    }
    async findallartistimageandname() {
        try {
           const images=await EventModel.aggregate([
            {
                $match:{
                    isDeleted: false
                }
            },
            {
                $project:{
                    _id:1,
                    images:1,
                    artistname:1,
                    artistrole:1,
                }
            }
           ])
           return images;
        } catch (error) {
            throw error;
        }
    }
     
    async findallupcamingevents() {
        try {
           const images=await EventModel.aggregate([
            {
                $match: { 
                    isDeleted: false,  
                    date: { $gte: new Date() } 
                }
            },
            {
                $project: {
                    __v: 0,
                }
            },
            
            {
                $sort: { date: -1 } 
              },
              {
                $limit: 6 
              }
           ])
          
           return images;
        } catch (error) {
            throw error;
        }
    }
    async findallgatallevents() {
        try {
            const events = await EventModel.aggregate([
                {
                    $match: { 
                        isDeleted: false,  
                        date: { $gte: new Date() } 
                    }
                },{ 
                    $sort: { date: 1 } 
                },{
                    $project:{
                        videos:0,
                    }
                }
                
            ]);
            
            return events;
    
        } catch (error) {
            throw error;
        }
    }
    async findallevents() {
        try {
            const events = await EventModel.aggregate([
                {
                    $match: { 
                        isDeleted: false 
                    }
                },{ 
                    $sort: { date: 1 } 
                }
                
            ]);
            
            return events;
    
        } catch (error) {
            throw error;
        }
    }
    
    async eventsearchdata(searchFilter) {
        try {
            const images = await EventModel.aggregate([
                {
                    $match: searchFilter  
                },
                { 
                    $sort: { date: 1 } 
                },{
                    $project:{
                        videos:0,
                    }
                }
            ]);
            
            return images;      
        } catch (error) {
            throw error;       
        }
    }
    async eventcatagoroandall() {
        try {
            const images = await EventModel.aggregate([
                {
                    $match: {
                        isDeleted: false,
                    }
                },
                {
                    $group: {
                        _id: null,
                        categories: { $addToSet: "$catagory" },
                        venue: { $addToSet: "$location.city" },
                        dates: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } } 
                    }
                }
            ]);
            const result = images.length > 0 ? images[0] : { categories: [], venue: [], dates: [] };
            return result;
    
        } catch (error) {
            console.error("Error in aggregation:", error);
            throw error;
        }
    }
    
    async presentevents() {
        try {
           const images=await EventModel.aggregate([
            {
                $match: { 
                    isDeleted: false,  
                    date: { $gte: new Date() } 
                }
            },
            {
                $project: {
                    videos: 0 
                }
            }
            ,{
                $sort: { date: -1 }
              },
              {
                $limit: 3 
              }
           ])
          
           return images;
        } catch (error) {
            throw error;
        }
    }
    
    async homepopulerdatas() {
        try {
           const images=await EventModel.aggregate([
            {
                $match: { 
                    isDeleted: false,  
                    date: { $gte: new Date() } 
                }
            },
            {
                $project: {
                    videos: 0 
                }
            }
            ,{
                $sort: { date: -1 } 
              },
              {
                $limit: 4 
              }
           ])
          
           return images;
        } catch (error) {
            throw error;
        }
    }
    
    async singleeventdata(id) {
        try {
           const images=await EventModel.findById(id)
          
           return images;
        } catch (error) {
            throw error;
        }
    }
    
    async delete(id) {
        try {
            let deletedData = await EventModel.updateOne(
                {
                    _id: id,
                },
                {
                    isDeleted: true,
                }
            );
            console.log("deleteddata",deletedData);
            
            return deletedData;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new EventRepositories();
