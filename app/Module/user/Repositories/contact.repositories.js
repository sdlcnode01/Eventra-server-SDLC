const contact = require("../Model/contact.model");

class contactrepo{
    async adddata(data){
        try {

            const contactdata = await contact.create(data)

            return contactdata;
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports=new contactrepo()