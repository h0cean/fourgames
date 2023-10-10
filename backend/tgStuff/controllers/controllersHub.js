const  startCommand = require('./onText/startCommand');
const unknownTextMessage = require('./onText/unknownTextMessage');

const controllers = [];
const controllersIndex =[];

const addController = (urlEntry, callback)=>{
	
	controllersIndex.push(urlEntry);
	
	controllers.push({callback});
}

const findByUrl = (url)=>{
	
	const index = controllersIndex.findIndex( element => { return (element ===url); } );
	
	return (index < 0)?  false :  controllers[index];	
}

addController('/start', startCommand, true);
addController('unknownTextMessage', unknownTextMessage, false);

module.exports = {find:findByUrl }
