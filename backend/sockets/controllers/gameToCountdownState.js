const startGame = require('./startGame');
const countdownTimeExpired = require ('./countdownTimeExpired');
const servers = require('../../servers');

const  setCountdownState = (game)=> {
    const io = servers.io();
    const timer = setTimeout( ()=>{      
      startGame(game);
    }, game.getCountDownToStartSeconds() * 1000);

    try {
      game.itsCountdownTime();
      
      io.of('/gameserver').in(game.gameChannel).emit('countingDown' , 
        game.listMap()
      );
      console.log('counting down')
    
    } catch (e) {
      console.log(e)      
      clearTimeout(timer);
      throw e;
    }
  }

module.exports = setCountdownState;