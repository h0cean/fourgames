/***************** THIS should be moved to ioMiddlewars folder */
const User = require('../sockets/mongooseSchemas/userSchema');

// Avatars and Colors are static-data
const Avatars = require('../data/userAvatars');
const Colors = require('../data/colorTypes');

/**
 * Main job for this function :
 * is to sync user-related-data coming from telegram with db-data
 * and it assigns latest version of user-data to socket.dbUser
 * socket.dbUser is mongoose model
 **/
const getByWebBotUser  = async (socket ,next)=>{
	try{		
		const user = await getByTgUser(socket.webBotUser);
		socket.dbUser = user;
		return next();
	}catch(e){		
		return next(`something went wrong during initing db user by webBotUser ${e}`);
	}
}

/**
 * lets check db : to create/update user-related data we need in front-end 
 * @return: mongoose-model
 *
 **/
const getByTgUser = async (tgUser)=>{	
	let user = await User.findOneAndUpdate( 
		{ 
			tgUserId: tgUser.id 
		},
		{
			firstName: tgUser.first_name,
			tgUsername: tgUser.username,
			languageCode: tgUser.language_code,
		},
		{
			new:true // 'new' field means: return the new version! 
		});
	if(!user) { user = await brandNewUser(tgUser) };
	
	return user;
}

/**
 * create a new user in db with random color and random avatar
 **/ 
const brandNewUser = async (tgUser) => {	
	const user = new User({
		tgUserId : tgUser.id,
		firstName: tgUser.first_name,
		tgUsername: tgUser.username,
		languageCode: tgUser.language_code,
		color: Colors.randomOne(),
		avatar: Avatars.randomOne()
	
	});	
	await user.save();	
	return user;
}

module.exports = {getByWebBotUser, getByTgUser}
