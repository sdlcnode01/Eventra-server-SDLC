const servicesModel = require("../Model/servise.model");

class adminRepositories{
    async create(data) {
        try {
            let savedData = await servicesModel.create(data);
           

            return savedData;
        } catch (error) {
            throw error;
        }
    }
    async servicesdataall() {
        try {
            let Data = await servicesModel.find({
                isDeleted:false,
                type:'services'
            });
           

            return Data;
        } catch (error) {
            throw error;
        }
    }
}
module.exports=new adminRepositories()