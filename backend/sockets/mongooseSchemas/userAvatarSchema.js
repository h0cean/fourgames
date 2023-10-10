const mongoose = require('../../data/mongooseConn').mongoose;
const avatar = new mongoose.Schema({
		
	avatarId: Number,
	avatarPhotoPath: String
	
});


module.exports = avatar;