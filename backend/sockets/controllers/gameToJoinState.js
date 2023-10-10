const joinTimeExpired = require('./joinTimeExpired');

const setJoinState =(game)=>{

  const t = setTimeout( async ()=>{
      await joinTimeExpired(game);
    },
    game.getJoinTime() * 1000
  );

  try {
    game.itsJoinTime(t);
     //for a game just created this callback works as joinAsPlayer for its creator:    
  } catch (e) {
    clearTimeout(t);      
    throw `its Join Time err ${e} `;
  }
}


module.exports = setJoinState;