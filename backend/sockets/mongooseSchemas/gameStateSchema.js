const mongoose = require('../../data/mongooseConn').mongoose;
const gameStateSchema = new mongoose.Schema({
	
	id : Number,
	playerID: Number, //optionall for some states
	

	name: String,
	description: String,
	
	exp: Number,
	
	createdAt: Number


});


module.exports = gameStateSchema;