const Joi = require("joi"); 

const moveSchema = Joi.object().keys({
	col: Joi.number().max(10).required()
});



module.exports = {
	newMove : moveSchema
}