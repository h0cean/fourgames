
observeGame =  (socket, game)=>{

    //add user to socket events channel to observe (listen to events) :
    socket.join(game.gameChannel); 
    socket.webBotUser.observingGame = game;
    
    // sending data related to game and user-history in that game:
    socket.emit('gamePublicData', { 
        game: game.listMap(socket.webBotUser.userId) 
    }); 
}

module.exports = observeGame;