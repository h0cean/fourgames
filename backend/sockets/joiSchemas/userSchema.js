const Joi = require("joi"); 
const avatars = require('../../data/userAvatars').all;
const colors = require('../../data/colorTypes').all;

const avatarIds = avatars.map(avatar => avatar.id );
const colorIds = colors.map(color => color.id );


const changeAvatarSchema = Joi.object({
	id: Joi.string().valid(...avatarIds)
});

const changeColorSchema = Joi.object({
	id: Joi.number().integer().valid(...colorIds)
})



module.exports = {

	changeAvatar: changeAvatarSchema,
	changeColor: changeColorSchema,



}
