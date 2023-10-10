/* db connection, (dont forget to fill .env file in project root )*/

const mongoose = require('mongoose');

const connectToMongoose =async (serverName, port , dbName )=>{
	await mongoose.connect(`mongodb://${serverName}:${port}/${dbName}`,{	 
		useNewUrlParser: true,useUnifiedTopology: true 
	});
	console.log('### connected to Db')

}




module.exports = {mongoose, connectToMongoose};
