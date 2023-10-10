
const tgBot = require('../telegramMain').bot;
const JoiSocketSchemas = require('../../sockets/joiSchemas/mainSchema');
const creatables  = require('../../data/gameTypes').creatables;
const findGameTypeById = require('../../data/gameTypes').finder;
// const joiSchema = require('../../../joiStuff/registerWithCodeFromTg');
// const User = require('../../../mongoStuff/mongooseSchemas/user');

const newChosenInlineResult =async (msg, user, gameServer)=>{
	
	try{
		const extraData = parseMsgToCreateGame(msg); 
		
		await gameServer.createGameByChosenInlineQuery(msg.from,user, extraData, (err, newGame)=>{
			if(err) throw(err);
			
		});
	}catch(e){
		console.log(e)
		// error cases:
		//not valid resultId to parse : we can edit inline message generated to inform everyone its a broken link 
	}
}
//result_id pattern: `${gameType.id}/${playersCount}/${randomId}` //todo move to module
const parseMsgToCreateGame = (msg)=>{
	const extraData = msg.result_id.split('/');
	if(extraData.length < 1) throw('not valid resultId');
	if(extraData[0]==='create' &&extraData.length ===5){
		return { 
			typeId: extraData[1],
			playersCount: extraData[2],
			publicId: extraData[3],
			contextType: extraData[4]
		 };

	}

}

module.exports = newChosenInlineResult;