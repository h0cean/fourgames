//todo change name to after player turn !

const afterGameFinished = require('./afterGameFinished')
const  gameToNextTurn  = require('./gameToNextTurn');

const afterPlayerPlayed = async (game)=>{
	try{
    if(game.isFinished()) {      
      await game.finishCallback('gameFinished',  game.listMap() ); //deactive in db 
      // await afterGameFinished(game);
    }else{
      gameToNextTurn(game);
      
    }
  }catch (e) {
    console.log(e)
    
    throw e;
  }
}


module.exports = afterPlayerPlayed