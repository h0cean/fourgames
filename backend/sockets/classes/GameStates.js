/* objects of this class works as game state data container*/
class GameState {
  constructor(id, name, description, expirationTime = -1, specificPlayer = -1) {
    
    this.id = id;
    this.name = name;
    this.description = description;

    this.exp = expirationTime;
    this.playerId = specificPlayer;

    this.createdAt = Math.round(new Date().getTime() / 1000);
  }

  //all  text-data
  getFull() {
    return `${this.name}: ${this.description}`;
  }

  //data that is ok to pass to clients
  getMap() {
    return {
      gameStateId: this.id,
      name: this.name,
      desc: this.description,
      exp: this.exp,
      since: this.createdAt, 
  
    };
  }
  //data to pass to client as minimum visible data of state
  publicListMap() {
    return {
      id: this.id,
      name: this.name,
    };
  }

  dbMap() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      exp: this.exp,
      createdAt: this.createdAt,
    };
  }

  isPreflight() {
    return this.id === 1;
  }

  isJoinState() {
    return this.id === 2;
  }

  isCountingDown() {
    return this.id === 3;
  }

  isPlaying() {
    return this.id === 4;
  }

  isPlayerTurn(playerId) {
    return this.playerId === playerId;
  }

  isFinished() {
    return this.id === 5;
  }
  isPolling() {
    return this.id === 6;
  }

  isBetweenTurns() {
    return (this.id === 7);
  }
}

const preFlight = () => {
  return new GameState(1, 'preflight', 'configING room' ,-1);
};

const waitingForJoin = (expireTime) => {
  return new GameState(2, 'waitingForJoin', 'waiting for join', expireTime);
};
const countingDown = (expireTime) => {
  return new GameState(3, 'countingDown2Start', 'count down to play', expireTime);
};

// this platform is designed for hot-seat based games idea, and we can track playing player by state too
// player id is the player who is allowed to play now
const playing = (expireTime, playerId = -1) => {
  return new GameState(4, 'playing', 'player playing', expireTime, playerId);
}; 

//here winner(s) should be concluded
const finished = () => {
  return new GameState(5, 'finished', 'winners concluded');
}; 

 //here winner(s) should be concluded
const polling4Rematch = (expireTime) => {
  return new GameState(6, 'polling4Rematch', 'players can vote for a rematch', expireTime);
};

const betweenTurnDelay = (expireTime = -1) => {
  return new GameState(7, 'betweenTurnDelay', 'brief of time between Turn', expireTime);
};

const canceledForReason = (reason = 'canceled-not-enough-players') => {
  return new GameState(99, 'canceled', reason);
};

module.exports = {
  preFlight: preFlight,
  waiting4Join: waitingForJoin,
  countingDown: countingDown,
  playing: playing,
  finished: finished,
  betweenTurnDelay: betweenTurnDelay,
  polling4Rematch: polling4Rematch,
  canceled: canceledForReason,
};
