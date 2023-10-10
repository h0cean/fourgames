
const tgBot = require('../telegramMain').bot;
const crypto = require('crypto');
const JoiSocketSchemas = require('../../sockets/joiSchemas/mainSchema');
const creatables  = require('../../data/gameTypes').creatables;
const findGameTypeById = require('../../data/gameTypes').finder;


const newInlineQuery = (msg, user, gameServer)=>{
	
	console.log(msg)
	const userAsPlayer =  gameServer.findPlayerByTgId(msg.from.id)

	if(userAsPlayer){
		//user is already playing other games and have a connected socket
		const game = gameServer.findGameByID(userAsPlayer.gameId);
		if(game.gameState.isJoinState()){
			answerInlineQueryWithShareGame(msg, game)
		}else{
			//game is started
			answerInlineQueryWithBackToGame(msg, userAsPlayer)
		}
		
	}else{
		answerInlineQueryWithTypes(msg );
		//user is not an active player : so he can get links to create new game based on the inline-query
		
		
	  
	}
	/**/
}

const answerInlineQueryWithTypes = (msg)=>{
	const results = queryResults(msg)
	tgBot.answerInlineQuery(msg.id, results,{
		is_personal:true,
		cache_time: 0,
		// switch_pm_text:'You Have An Unfinished Game, Tap to Play...',
		// switch_pm_parameter : `getGame_`,
		// button:{
		// 	text:'it is testApp',
		// 	web_app:{
		// 		url:'https://t.me/FourGamesBot/test4Games?startapp=asdf'
		// 	}
		// }

	} ) ;
}
const answerInlineQueryWithShareGame = (msg, game)=>{
	const result = shareGameInlineResult(game);
	tgBot.answerInlineQuery(msg.id, [result] ,
		{
			is_personal:true,
			cache_time: 0,

		}) ;

}
const answerInlineQueryWithBackToGame = (msg, userAsPlayer)=>{
	tgBot.answerInlineQuery(msg.id, [],	{
			is_personal:true,
			cache_time: 0,
			switch_pm_text:'tap to Share Your Game...',
			switch_pm_parameter : `getGame_${userAsPlayer.gameId}`

		}) ;
}

const gameTypeAsInlineResult = (chat_type, userId, gameType, playersCount)=>{
	
	const randomId = crypto.randomUUID();;
	return {
		type:'article', 
	
		id: `create/${gameType.id}/${playersCount}/${randomId}/${chat_type}`, //todo move to module
	
		title: `Play Game: ${playersCount} Players`,
		
		input_message_content: {
			message_text:`Hello.... lets Play, its fun to play ${gameType.name}`
		},
		reply_markup :
		{
			inline_keyboard: [
				[ 
					{ text: `\u{1F469}\u{200D}\u{1F3EB} LetsPlay ${gameType.name}`, url:`${process.env.APP_URL}?startapp=${randomId}`} 
				],				// [ { text: '  \u{270D} Course Video', callback_data:'newCourseVideo'}  ]
			]
		},
		url:'https://t.me/fourgamechannel',
		description:` play ${gameType.name} with ${playersCount-1} of your friends `,
		thumbnail_url:'https://t.me/FourGamesChannel/4'
	}
}

const shareGameInlineResult = (game)=>{
	return {
		type:'article', 
	
		id: `share/${game.id}`,

		title: `Share`,

		input_message_content: {
			message_text:`Join Me in This Game`
		},
		reply_markup :
		{
			inline_keyboard: [
				[ 
					{ text: `\u{1F469}\u{200D}\u{1F3EB} LetsPlay ${game.typeName}`, url:`${process.env.APP_URL}?startapp=${game.publicId}`} 
				],				// [ { text: '  \u{270D} Course Video', callback_data:'newCourseVideo'}  ]
			]
		},
		description:` play with me in this game `,
		thumbnail_url:'https://t.me/FourGamesChannel/4'

	}
}


const queryResults = (msg)=>{
	const results = [];
	try{
		const parsedQuery = parseQuery(msg.query);
		
    	results.push(
    		gameTypeAsInlineResult(msg.chat_type, msg.from.id, findGameTypeById(  parsedQuery[0]) , parsedQuery[1])  
    		);
    
	}catch(e){
		//cant parse query!
		
	   	for(const gameType of creatables){
    		for (let i = gameType.minPlayers; i <= gameType.maxPlayers ; i++) {
    			
    			let inlineResult = gameTypeAsInlineResult(msg.chat_type,msg.from.id,gameType, i);
				results.push(inlineResult);
    		}
    	}
	}	  
	return results;

}
const parseQuery = (query)=>{

	const data = query.split('/');
	if(data.length!==2) throw('not valid query');
	
	const validationResult = JoiSocketSchemas.gameModeSchema
		.validate({
			typeId: data[0],
			playersCount: data[1]
	});	

	if (validationResult.error) throw('not valid query');

	return data;

	


}

module.exports = newInlineQuery;