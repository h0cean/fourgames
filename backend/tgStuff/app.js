const tg = require("./telegramMain");
const tgBot = tg.bot;
const path = tg.pathToken;
const MessageResolver = require('./newMessageResolvers/main');
const fetchUserRecord = require('../expressStuff/fetchDbUser').getByTgUser;

const toBeRespondedUsers = [];
let processingIds = [];
const loadListeners = (gameServer)=>{
	
	tgBot.on('message', (msg)=>{
		console.log('newMSG');
		processingIds.push(msg.from.id)
	})
	
	tgBot.on('text', async (msg, meta)=>{
		// if(meta.processing) return; 
	
		await MessageResolver.text(msg, meta);
		// meta.finishProcess();

	});
	
	tgBot.on('inline_query',async (msg,meta)=>{
	
		await MessageResolver.inlineQuery(msg, gameServer) ;
	});

	tgBot.on('chosen_inline_result',async (msg, meta)=>{
	
		await MessageResolver.chosenInlineResult(msg, gameServer);		
	});



	tgBot.on('error', (e)=>{

		console.log('Tg bot lib Err', e);
	})
	tgBot.on('webhook_error', (e)=>{

		console.log('Tg bot lib Err', e);
	})
	tgBot.on('polling_error', (e)=>{

		console.log('Tg bot lib Err', e);
	})

// tgBot.on('callback_query', MessageResolver.callbackQuery );//=>this will connect new text to controllerHUb
}




const main = (req,res)=>{

	tgBot.processUpdate(req.body)

	res.sendStatus(200);

}
const isAnyProcessGoingOn = (msg)=>{
	return processingIds.find((element)=> element===msg.from.id )
}
// tgBot.on('message', newMessage);

/*tgBot.onText(/\/ping/, (msg)=>{
	tgBot.sendMessage(msg.chat.id, 'Pong');
});*/
// tgBot.onText(/login/,loginToAdminArea)

// tgBot.on('video', newVideo) ;

// tgBot.on('webhook_error', (error) => {
//   console.log(error);  // => 'EPARSE'
// });


module.exports = {
	router: main, 
	path: path,
	loadListeners: loadListeners,
	botInstance:tgBot
}