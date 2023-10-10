const leaveGame = async(socket, switchBackGameState)=>{
      
      const user = socket.webBotUser;
      const theGame = user.currentGame;
console.log('theGame.players.length',theGame.players.length )
      theGame.leavePlayer(user.playerState);

      if(!theGame.hasAnyPlayer()){
            console.log('hasnt player canceld then')
console.log('theGame.players.length',theGame.players.length )
            theGame.gameCanceled('everyBody left before start');
            await theGame.cancelCallback('gameCanceled', {}, 'everyBody left ', socket);                  
      }else{
            //stay in join Time by calling                   
            // switchBackGameState();         
            playerLeftEmit(socket, user ,theGame);
      }  
}


const playerLeftEmit = (socket , user, theGame)=>{
   socket.to(theGame.gameChannel).emit('playerLeft', {userId: user.id, playerId: user.playerState.id});      
   socket.leave(theGame.gameChannel);                 
}

module.exports = leaveGame;