const Joi = require("joi"); 
Joi.objectId = require('joi-objectid')(Joi);

// required data to validate works:
const creatables = require('../../data/gameTypes').creatables;
const creatableTypeIds = creatables.map(creatable => creatable.id );

// internal-use schemas:
const userSchemas = require('./userSchema');
const playersCountSchema = Joi.number().integer().min(2).max(4).required();
const gameTypeIdSchema = Joi.number().integer().valid(...creatableTypeIds).required();
const gamePublicIdSchema = Joi.string().guid().required();

// to-export schemas:


const	changeUserAvatarSchema = userSchemas.changeAvatar; 	
const	changeUserColorSchema = userSchemas.changeColor; 	

const gameModeSchema = Joi.object( { 
      typeId: gameTypeIdSchema,
      playersCount: playersCountSchema
});

const createGameSchema = Joi.object({            
      typeId: gameTypeIdSchema,
      playersCount: playersCountSchema,
      publicId: gamePublicIdSchema,
      contextType: Joi.string().valid( 'sender','private', 'group', 'supergroup', 'channel'),

});

const findRoomByPublicId =   Joi.object({
	publicId: gamePublicIdSchema
});

const findRoomByIdSchema = Joi.object({
	gameId: Joi.objectId().required()
}).unknown(true);

const newMoveSchema = Joi.object({	
	move : Joi.object().required()

});

module.exports = { 
	gameModeSchema: gameModeSchema,
	
	createGameSchema: createGameSchema, 
	findRoomByIdSchema: findRoomByIdSchema ,
	findRoomByPublicId : findRoomByPublicId,
	newMoveSchema: newMoveSchema,

	changeUserAvatarSchema : changeUserAvatarSchema,
	changeUserColorSchema: changeUserColorSchema
};
