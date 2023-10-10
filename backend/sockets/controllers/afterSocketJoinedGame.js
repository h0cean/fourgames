const setCountdownState = require('./gameToCountdownState');

const afterSocketJoinedGame =  (socket, game)=>{
	if (socket.webBotUser.observingGame) {    
	  socket.leave(socket.webBotUser.observingGame.gameChannel);
	  socket.webBotUser.observingGame = '';
	}

	socket.to(game.gameChannel).emit('playerJoinedGame',{
		id: game.id, 		
		player: socket.webBotUser.playerState.inGameMap()
	});

	socket.emit('yourCurrentGame', {
		game: socket.webBotUser.currentGame.listMap(socket.webBotUser.id),
		playerId: socket.webBotUser.playerState.id
	});

	socket.join(game.gameChannel);	
	if (!game.hasEmptySeat()) {
    	game.stopJoinTimer();
    	setCountdownState(game);
  	}
}

module.exports = afterSocketJoinedGame;
