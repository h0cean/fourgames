
const rejoinGame = (socket, game)=>{

        const data = {
                game: socket.webBotUser.currentGame.listMap(socket.webBotUser.id),
                playerId: socket.webBotUser.playerState.id
        };    
        socket.emit('yourCurrentGame', data);
        socket.join(socket.webBotUser.currentGame.gameChannel);


}

module.exports = rejoinGame;