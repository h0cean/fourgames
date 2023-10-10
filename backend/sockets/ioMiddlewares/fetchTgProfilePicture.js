const https = require('https');

const fs = require('fs');
const crypto = require('crypto');

const randomAvatar = require('../../data/userAvatars').randomOne;
const tgBot = require('../../servers').tg;
const dirPath = `${process.env.PUBLIC_PATH}${process.env.PICS_PATH}/`;
const fetchTgProfilePicture = async (socket ,next)=>{	
	try{
		const result = await tgBot.getUserProfilePhotos(socket.webBotUser.id);
		console.log(`${socket.webBotUser.first_name}  profile-picture-api: total_count`, result.total_count);
		if(result.total_count === 0  ){
			//zero total means: user-profiles in file-system/db-record  no longer needed and should be deleted:
			if(socket.dbUser.hasProfilePicture) await deleteLastProfilePicture(socket.webBotUser);
			return next();
		
		}else{
			/**
			 * take note that: next line will pass control on how to call next function 
			 * (it can be another middleware in future refactors)
			*/
			await updateProfilePictureIfNeeded(socket, result.photos[0][0], next );
			
		}
	}catch(e){
		
		return next(e);
		
	}

}

/**
 * set new profile picture in db (also delete last one)
 * change avatar if it set to be profile picture
 * take note that avatar is not a refrence so if profile picture changes, we need to copy its new value to avatar too)
 *  * 
 * */
const setNewLatestProfilePicture = (dbUser, photoId, fileName)=>{
	
	if(dbUser.hasProfilePicture) deleteProfilePictureFile(dbUser.photoPath);//delete the last one before this one

	if(dbUser.avatar.id === dbUser.profilePicture.tgId){//means user-avatar is set to latest profile picture
	  dbUser.avatar = { id: photoId, photoPath:fileName };
	}		

	dbUser.hasProfilePicture = true;
	dbUser.profilePicture = { tgId: photoId, photoPath: fileName};

}
/**
 * user have no profile picture so : we have old data saved( this function only get called if there is any old data )
 * then we should delete profile picture record from file-system and db
 * in case user using profile picture as in-game-avatar: reset avatar
 **/
const deleteLastProfilePicture = async (dbUser)=>{
	//file system phase:
	deleteProfilePictureFile(dbUser.profilePicture.photoPath);	
	
	//db phase:
	if(dbUser.avatar.id === dbUser.profilePicture.tgId) {
	 	dbUser.avatar = randomAvatar();
	}
	dbUser.hasProfilePicture = false;
	dbUser.profilePicture = {tgId: '', photoPath: ''};

	await socket.dbUser.save();
}

/**
 * delete in file system
 **/
const deleteProfilePictureFile = (photoPath)=>{
	fs.unlink(`${dirPath}${photoPath}`, (err)=>{ 
		if(err) throw(`delete profile picture file err: ${err}`) 
	});
}

const updateProfilePictureIfNeeded = async (socket ,tgPhoto,next)=>{	
	if( !socket.dbUser.hasProfilePicture || (tgPhoto.file_unique_id !== socket.dbUser.profilePicture.tgId) ){
		//have to update last profile picture : cases are: user-record have no profile picture or have the old data...
		const photo = await tgBot.getFile(tgPhoto.file_id); //get link to download it from telegram servers
		const photoUrl = `https://api.telegram.org/file/bot${process.env.TG_TOKEN}/${photo.file_path}`;
		const fileName = `${socket.webBotUser.id}-${crypto.randomUUID()}-${new Date().getTime()}.jpg`;
		const fullPath = `${dirPath}${fileName}`;

		const file = fs.createWriteStream(fullPath);
		https.get(photoUrl, async (response) => { 
			response.pipe(file);
			file.on('finish', async () => {
				try{
					file.close();					
					setNewLatestProfilePicture(socket.dbUser, photo.file_unique_id, fileName);
					await socket.dbUser.save();	
					next();
				}catch(e){
					return next(`error on finishing saving profile picture in file system ${e}`);
				}			
			});
		})
		.on('error', (err) => {
				try{
					fs.unlink(fileName);
					return next(`https error while downloading file ${err}`);
				}catch(e){
					return next(`Error inside another error handling! first downloading image failed and then unlinking the file opened to write the image into failed! ###1:${err}###2:${e}`);
				}
			});
	}else{ 
		// 'profile pic not changed from the last time we updated it'
		return next();
	}		
}

module.exports = fetchTgProfilePicture;