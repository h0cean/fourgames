const ioIniter = require('../../servers').io;
const turnTimeExpired = require ('./turnTimerExpired' )
const startGame = (game)=>{
  const io  = ioIniter();
  
  let t = setTimeout(async ()=>{
    try{
      await turnTimeExpired(game)
    }catch(e){
      console.log(e);
    }
  },game.getEachMoveTime() * 1000 );

  try {
    game.itsFirstTurn(t); 
    io.of('/gameserver').in(game.gameChannel).emit('gameStarted' , {id: game.id});
    
    const player = game.turnPlayer();
    io.of('/gameserver').in(game.gameChannel).emit('playerTurn', {
      gameId: game.id,  
      playerId: player.id, 
      userId: player.userId, 
      allPlayTime: player.allPlayTime 
    });
    
  } catch (e) {
    console.log(e);    
    clearTimeout(t);
    //cant throw it called inside timer
  } 
}


module.exports = startGame