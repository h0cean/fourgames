const authenticate = require('./ioMiddlewares/auth');
const fetchUserDbRecord = require('../expressStuff/fetchDbUser').getByWebBotUser;
const fetchTgProfilePicture = require('./ioMiddlewares/fetchTgProfilePicture');
const GameServer = require('./classes/gameServer'); 
const gameTypes = require('../data/gameTypes').types;
const colors = require('../data/colorTypes').all;
const avatars = require('../data/userAvatars').all;
// servers.io = socketIoIniter();

const initServer = (servers)=>{
   
   const  gameServer =  new GameServer( servers ,1, 
     'testNet','/gameserver',
     { gameTypes, colors, avatars }, 
     [] 
    );
    

    //middleswares
    servers.io().of(gameServer.namespace).use(authenticate);   
    servers.io().of(gameServer.namespace).use(fetchUserDbRecord);   
    servers.io().of(gameServer.namespace).use(fetchTgProfilePicture);
    
    // new connection listener : introduce new socket-connection to gameserver:
    servers.io().of(gameServer.namespace).on('connect', (socket)=>{
        try{
            console.log('New connection')
            gameServer.newConnection(socket);
        }catch(e){            
            console.log('something went wrong ,,,,socket will be disconnected', e);
            socket.disconnect();
        }
    });
    return gameServer;    
}


module.exports = {initServer};