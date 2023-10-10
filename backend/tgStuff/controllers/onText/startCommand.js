const tgBot = require('../../telegramMain').bot;
// const joiSchema = require('../../../joiStuff/registerWithCodeFromTg');
// const User = require('../../../mongoStuff/mongooseSchemas/user');


const startCommand  = async (msg,META)=>{
	console.log(META);
	console.log(msg);
	console.log('####################################');	
	tgBot.sendMessage(msg.chat.id, 'Select', 
		{
			reply_markup :
		{
			inline_keyboard: [
				[ 
					{ text: '  \u{1F469}\u{200D}\u{1F3EB} Instructor Video', web_app:{url:'https://fourgames.shiftboro.net'}} 
				],				// [ { text: '  \u{270D} Course Video', callback_data:'newCourseVideo'}  ]
			]
		},

			reply_to_message_id:msg.message_id

		}
	)
}

module.exports = startCommand;