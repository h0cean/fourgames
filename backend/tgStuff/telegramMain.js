const TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.TG_TOKEN;

//  if you are running your own local bot-api-server then you may need to modify baseApiURL to send api requests to your local-machine 
const bot = new TelegramBot(TOKEN/*, {baseApiUrl:apiURL}*/);

const path = process.env.BOT_PATH;
const pathToken = `${path}/bot${TOKEN}`;

/** Setting WebHook For bot
 * solution 1: 
 *  modify and open this url in your browser: 
 *  https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${process.env.BOT_HOST_URL}/${pathToken}
 
 * solution 2: 
 *  you can programaticlly check/set/delete webhook:\
 *  by using getWebhookInfo, setWebhook, deleteWebhook of tg-bot-api
 
 * solution 3:
 * you can setWebhook by uncomenting the line below! 
 * DONT-Forget: to comment it again after it is called
*/
console.log(pathToken);
bot.setWebHook(`${process.env.BOT_HOST_URL}/${pathToken}`); 


module.exports = {bot, pathToken};
