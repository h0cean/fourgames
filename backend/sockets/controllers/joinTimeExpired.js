
const setCountdownState = require('./gameToCountdownState');

const joinTimeExpired =  async (game) => {

  if (game.hasMinPlayer()) {
    //Has minimum player.length?yes=> can go to nextState which is start-countDown
    setCountdownState(game);
    
  } else {
    console.log('game not reached min-players')
    // await this.roomNotReachedMin(game); //this gracefull shutdown of game will not throw
      // this.roomCanceledEmits(room);
      game.gameCanceled('canceld : not reached min player ');
      await game.cancelCallback('gameCanceled',{ gameId: game.id }, 'not reached min player'); //deactive in db 
      // await this.deactiveRoomAndPlayers(room, 'not reached min player');
  }

  // n.check4Start();
}


module.exports = joinTimeExpired;