//its play state but we changed it to between turn delay
const concedeGame = async (socket, switchBackGameState)=>{
	const theGame = socket.webBotUser.currentGame;
	theGame.concedePlayer(socket.webBotUser.playerState);
    if (theGame.canFinish()) {
      theGame.gameFinished();
      await theGame.finishCallback('gameFinished',  theGame.listMap() ); //deactive in db 
          // await afterGameFinished(theGame);
    }else{      
      playerLeftEmit(socket);
    }
}

const playerLeftEmit = (socket )=>{
   
   socket.to(socket.webBotUser.currentGame.gameChannel)
   .emit('playerLeft', {
      userId: socket.webBotUser.id, playerId: socket.webBotUser.playerState.playerId
   });      
   
   socket.leave(socket.webBotUser.currentGame.gameChannel);                 
}

module.exports = concedeGame;