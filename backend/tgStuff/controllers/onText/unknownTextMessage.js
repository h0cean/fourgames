
const tgBot = require('../../telegramMain').bot;

const unknownText  = async (msg,META)=>{
	
	await tgBot.sendMessage(msg.chat.id, 'unknown text');
}




module.exports = unknownText;