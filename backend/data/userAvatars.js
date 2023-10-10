/*
 * static datat container for user-avatar
*/

const UserAvatar = require('../sockets/classes/userAvatar');

const avatars = []; //all-avatars

avatars.push(
	new UserAvatar({
		id: 'OneVASDFGVS1', 
		photoPath:"1.jpg", 
		
	})
);
avatars.push(
	new UserAvatar({
		id: 'OVADSF1GVne1', 
		photoPath:"2.jpg", 
		
	})
);

avatars.push(
	new UserAvatar({
		id: 'OnVADFV23Ae1', 
		photoPath:"3.jpg", 
		
	})
);

avatars.push(
	new UserAvatar({
		id: 'OnBSFD21HGe1', 
		photoPath:"4.jpg", 
		
	})
);

avatars.push(
	new UserAvatar({
		id: 'FFDAF123One1', 
		photoPath:"5.jpg", 
		
	})
);

avatars.push(
	new UserAvatar({
		id: 'Onebsfdgasdg', 
		photoPath:"6.jpg", 
		
	})
);

avatars.push(
	new UserAvatar({
		id: 'Oadsfafdavsb', 
		photoPath:"7.jpg", 
		
	})
);

avatars.push(
	new UserAvatar({
		id: 'asdgfafa123A', 
		photoPath:"8.jpg", 
		
	})
);





const findOneById = (id) => {
 return avatars.find((element) => element.id == id);
 
};


const randomOne = ()=>{
	return avatars[(Math.floor(Math.random() * avatars.length))]
}

const defaultAvatar = ()=>{
	return avatars[0];
}

module.exports = {all:avatars, findOneById: findOneById, default : defaultAvatar, randomOne: randomOne};