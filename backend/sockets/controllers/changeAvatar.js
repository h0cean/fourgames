const randomAvatar = require('../../data/userAvatars').randomOne

const changeAvatar =async (socket , avatar )=>{
	
	if(avatar){
		console.log('a')
		socket.dbUser.avatar = avatar
	
	}else if(socket.dbUser.hasProfilePicture){
		// change avatar to profile picture
		console.log('b')
		socket.dbUser.avatar = {
			id: socket.dbUser.profilePicture.tgId,
			photoPath: socket.dbUser.profilePicture.photoPath
		}

	}else{
		console.log('c')
		//change to random one
		socket.dbUser.avatar = randomAvatar();
	}

	await socket.dbUser.save();




}
module.exports = changeAvatar