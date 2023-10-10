const newText = require('./newText')
const callbackQuery = require('./newCallbackQuery');
const newInlineQuery = require('./newInlineQuery');
const newChosenInlineResult = require('./newChosenInlineResult');
const fetchUserRecord = require('../../expressStuff/fetchDbUser').getByTgUser;
let processingIds = [];

const text = async (msg , meta)=>{
	// const processManager = checkProcessing(msg)
	if(isAnyProcessGoingOn(msg)){
	 	console.log('mutual')
	 	return ;	
	}
	processingIds.push(msg.from.id);

	const user = await fetchUserRecord(msg.from)	
	
	await newText(msg, user);

	processingIds = processingIds.filter(function (e) {
      return e !== msg.from.id;
    });

}

const chosenInlineResult = async (msg , gameServer)=>{
	// const processManager = checkProcessing(msg)
	if(isAnyProcessGoingOn(msg)){
	 	console.log('mutual')
	 	return ;	
	}
	processingIds.push(msg.from.id);
	const user = await fetchUserRecord(msg.from)	
	
	await newChosenInlineResult(msg, user, gameServer);

	processingIds = processingIds.filter(function (e) {
      return e !== msg.from.id;
    });
}
const inlineQuery = async (msg, gameServer)=>{
	if(isAnyProcessGoingOn(msg)){
	 	console.log('mutual')
	 	return ;	
	}
	processingIds.push(msg.from.id);
	const user = await fetchUserRecord(msg.from)	
	
	newInlineQuery(msg, user, gameServer);

	processingIds = processingIds.filter(function (e) {
      return e !== msg.from.id;
    });

}


// const checkProcessing = (msg)=>{
	
// 		const processing = isAnyProcessGoingOn(msg);
// 		const meta= {}
// 		if(processing){
// 			meta.isProcessing=true;
// 		}else{
	
// 			meta.isProcessing = false;
// 			meta.finishProcess = ()=>{
// 				processingIds = processingIds.filter(function (e) {
// 			      return e !== msg.from.id;
// 			    });
// 			}
// 		}
// 		return meta;
// }


const isAnyProcessGoingOn = (msg)=>{
	// console.log(processingIds)
	return processingIds.find((element)=> element===msg.from.id )
}
module.exports = {text, callbackQuery, inlineQuery, chosenInlineResult}