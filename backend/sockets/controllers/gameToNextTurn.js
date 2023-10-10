const turnTimeExpired = require('./turnTimerExpired');
const ioIniter = require('../../servers').io;

const gameToNextTurn =  (game)=>{
	const io  = ioIniter();
	let t = setTimeout( async ()=>{
		try{
			await turnTimeExpired(game);
		}catch(e){
			console.log(e);
		}
		
	},game.getEachMoveTime() * 1000 );
    try {
    	game.itsNextTurn(t); // can throw on not found new next turn 
			
			const player = game.turnPlayer();
	  	io.of('/gameserver').in(game.gameChannel).emit('playerTurn', {
	  		gameId: game.id,  
	  		playerId: player.id, 
	  		username: player.userId, 
	  		allPlayTime: player.allPlayTime 
	  	});
    } catch (e) {
      clearTimeout(t);
      throw e;
    }
}

module.exports = gameToNextTurn;