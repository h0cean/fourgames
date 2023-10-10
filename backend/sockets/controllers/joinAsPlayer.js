//dont forget that this is tgUser ! not socket
const joinAsPlayer = (tgUser, dbUser, game, callback)=>{
      try {      
            
            const player =  game.newPlayer(tgUser, dbUser); // we can delete player if and only if error happend AND player is new ( nothing to concern about since its a really rare )
            tgUser.currentGame = game;
            tgUser.playerState = player;
            
            callback('',game);      
      }catch(err){
            console.log(err);
            game.stopJoinTimer();  //pop room from cache
            throw err;
      }
}

module.exports = joinAsPlayer;