const mongoose = require('../../data/mongooseConn').mongoose;

// const userAvatarSchema = require('./userAvatarSchema');

const userSchema = new mongoose.Schema({
	
	tgUserId: { type: Number ,
		unique:true,
		index:true, 
		required:true 
	},
	firstName: { type: String, 
		required:true 
	},
	tgUsername: String,
	languageCode:String,
	color:{	
		id:Number,
		tailwind:String
	},
	avatar:{
		id: String,
		photoPath:String
	},
	profilePicture:{
		tgId: String,
		photoPath: String,
	},
	hasProfilePicture:{
		type:Boolean, 
		default:false
	},

	createdAt: {type: Date, default: Date.now},
});

const User = mongoose.model('User', userSchema);
module.exports = User;