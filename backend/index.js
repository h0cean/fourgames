#!/usr/bin/env node
require('dotenv').config();

const mongooseHandler = require('./data/mongooseConn').connectToMongoose;
const servers = require('./servers');
const initGameServer = require('./sockets/socketMain').initServer;
const tgApp = require('./tgStuff/app');


const initDb = ()=> mongooseHandler(process.env.MONGO_ADDRESS, process.env.MONGO_PORT, process.env.MONGO_DBNAME );
const loadHttpServer = ()=> servers.load(process.env.HTTP_PORT, process.env.HTTP_ADDRESS);
const initTgBotListeners = (gs)=> tgApp.loadListeners(gs);

/**** initializing game-server flow: ****/

initDb()

//stage-2 : pass express to socketIo & tg-bot-endpoint route to express 
.then(loadHttpServer)

//stage-3 : init game-server socket-event-listeners
.then(initGameServer)

//stage-4 : init tg-bot (telegram-node-bot-api server) and pass gameserver to it
.then(initTgBotListeners)

.catch( (e)=>{
	console.log('!!! fatal error: ', e); //todo log to file
	process.exit();
});

