const ioIniter = require('../../servers').io;
const afterPlayerPlayed = require('./afterPlayerPlayed');
const playerPlayed = async (socket, move, ack)=>{
	const io  = ioIniter();
	const theGame = socket.webBotUser.currentGame;
	if(theGame.newMove(socket.webBotUser.playerState,move)){ 
		//if newMove returns true , move was valid 
	
	
		io.of('/gameserver').in(theGame.gameChannel).emit('newPlay' , {
	
			gameId: theGame.id,
			playerId: socket.webBotUser.playerState.id, 
			col: move.col, 
			scores: theGame.currentScoresMap()   
		});
		ack({ok:true, httpCode:200});
		//turnlock
		if(theGame.canFinish()) {              
	      theGame.gameFinished();
	  	}
		await afterPlayerPlayed(theGame);
	}else{
		/**
		 * its not-logically valid move  from client 
		 * in this case not-logically means: not at right-time or not with currect data and Not expected from a no-bug client
		 * so we can throw to log BUT for a more specific error from the situation we need to change  game.newMove to pass back errors 
		*/	
		throw('not expected move from client');
	}
}

module.exports = playerPlayed;