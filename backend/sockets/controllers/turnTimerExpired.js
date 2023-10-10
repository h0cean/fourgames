const afterPlayerPlayed = require('./afterPlayerPlayed');
const ioIniter = require('../../servers').io;
const  turnTimeExpired =async  (game) =>{

    try {
      //turnlock
      /*const procedureCaller = () => {
        if(game.isBetweenTurns()) {
          setTimeout( await () => {
            await procedure();
          },0)
        } else {
          await procedure(game);
        }
      }
      procedureCaller();*/
      await procedure()
     
    } catch (e) {
      //throw ing is not possible
      console.log(e)
    }
    // else{} : the rare est happening happend! : check one second later maybe??
}


const procedure= async (game)=>{
  
  const player = game.turnTimerTrigered();
  const io  = ioIniter();
  io.of('/gameserver').in(game.gameChannel).emit('playerLeft', {userId: player.userId, playerId: player.playerId});
   
  if(game.canFinish()) {              
    game.gameFinished();
  }
  
  await afterPlayerPlayed(game);
}


module.exports = turnTimeExpired;