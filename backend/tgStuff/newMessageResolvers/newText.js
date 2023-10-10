// const tgBot = require('./telegramMain').bot;
const controllersHub = require('../controllers/controllersHub');

const main =async  (msg, user)=>{
		console.log('a')
	// if(msg.chat.id===731577852 || msg.chat.id ===109191279){ //these two are private
		try{
			msg.text = msg.text.trim() // seems unnecessory since telegram always send trimed value //update : third parties?? maybe this trim feature is cact implemented at server level of telegram :thinking: so its better to be here 
			
			//this finds or throws:
			
			const controller = findController(msg, user);
			
			
			 await controller(msg, user);
			
			return ;
		}catch(e){
			console.log('SOMETHING WENT WRONG')
			console.log(e);
		}
	
}

const findController = (msg, user)=>{
	const found = searchForCMD(msg.text, user);
	console.log(found)	
	if(found) {
		return found.callback;
	}else{

		return  controllersHub.find('unknownTextMessage').callback;
	}
}
const searchForCMD = (msgText, user) =>{
	const spaceIndexInText = msgText.indexOf(' ');

	let suggestedCommandInText = '';
	if (spaceIndexInText > 0){
		//grab only the first part: after space is the args to controller
		 suggestedCommandInText = msgText.substring(0, spaceIndexInText).trim();
	}else{
		// consider the whole text message as controller with no arg 
		suggestedCommandInText = msgText;
	}	
	return  controllersHub.find(suggestedCommandInText);
}

module.exports = main;
