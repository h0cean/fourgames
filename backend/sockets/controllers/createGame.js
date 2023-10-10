const setJoinState = require ('./gameToJoinState');
const joinAsPlayer = require ('./joinAsPlayer');

const createGame = async (creatorTgUser,dbUser, game, callback)=>{
  await game.createInDb(); 	
  
  setJoinState(game);        
  joinAsPlayer(creatorTgUser, dbUser, game, callback);

}


module.exports = createGame;