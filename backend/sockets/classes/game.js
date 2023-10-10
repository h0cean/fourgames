const GameStates = require('./GameStates');

class Game {

  constructor(dbModel) {
    this.model = dbModel; 
  }  

  isPlaying() {
    return this.gameState.isPlaying();
  }
  isFinished() {
    return this.gameState.isFinished();
  }
  canAnyoneJoin(){ //only creatables
    return (this.gameState.isJoinState() &&  this.hasEmptySeat() );
  }
  canAnyoneLeft(){
    return (this.gameState.isJoinState() || this.gameState.isPlaying());
  }
  hasEmptySeat(){ //overwrited in builtin games

    return (this.players.length < this.playersCount());
  }
  hasMinPlayer(){ //over-writed in builtin games

    return ((this.players.length) >= this.getMinPlayers()) ;
  }
  hasAnyPlayer(){
    return this.players.length > 0;
  }
  playersCount(){    
    return this.model.playersCount;
  }
  getBetweenTurnDelay(){
    return this.type.betweenTurnDelay;
  }
  getPlayerTotalTime(){
    return this.type.playerTotalTime;
  }
  getMinPlayers(){
    return this.type.minPlayers;
  }
  getMaxPlayers(){
    return this.type.maxPlayers;
  }  
  getTypeID(){
    return this.type.id;
  }
  getJoinTime(){
    return this.type.joinTime;
  }
  
  getCountDownToStartSeconds(){
    return this.type.countDownToStartSeconds;
  }
  getEachMoveTime(){
    return this.type.eachMoveTime;
  }

  /** 
   * using round internal index to find player inside players array , 
   * its not a good extendable design to find turn player with this pattern, and should be changed in future if someone wants to add new games
  */
  turnPlayer(){
    return this.players[this.currentRound.turnInternalIndex];
  }  
  updateStateToPlaying( playTimer){
    const now =Math.round( ( (new Date().getTime())/1000 ));
    this.setInernalState( GameStates.playing( now+this.getEachMoveTime()  ,this.currentRound.turnPlayerId()) );
    this.turnPlayer().startedPlayingAt  = now;
    this.setPlayerTurnStateTimer(playTimer);    
  }

  setInernalState(s) {
    this.gameState = s;
    this.model.state = s.dbMap();
  }  
  stateToDelayBetweenTurn(){    
    this.setInernalState(GameStates.betweenTurnDelay());
  }    
  gameCanceled(reason){
     this.setInernalState(GameStates.canceled(reason));
  }

  /**
   * this function callls only when we are in playingstate of game
  */
  itsJoinTime(joinTimer) {  
    const startInMS = new Date().getTime();
    this.joinTimer = joinTimer;
    this.initNewRound(startInMS); //this functionality should be specificly defined inside the game extended this class
    this.setInernalState(GameStates.waiting4Join(Math.round(startInMS / 1000) + this.getJoinTime()));
  }  
  gameFinished(){
    this.setInernalState( GameStates.finished() );    
  }
  itsCountdownTime(){        
    this.setInernalState( GameStates.countingDown(Math.round((new Date().getTime())/1000)+this.getCountDownToStartSeconds()) );
    this.currentRound.readyToRun();
  }
  itsFirstTurn(playTimer){            
    this.currentRound.itsFirstTurn();
    this.updateStateToPlaying( playTimer);        
  }
  itsNextTurn(playTimer){    
    this.currentRound.itsNextTurn();     //possible to throw if no next turn found
    this.updateStateToPlaying( playTimer);        
  }
  setPlayerTurnStateTimer(timerID){
    this.playerTurnTimer = timerID;
  } 

  /**
   * the player who is supposed to play is not played 
  */
  turnTimerTrigered(){
    const player = this.turnPlayer();    
    player.updateAllPlayTime();        
    this.currentRound.turnTimerExpired(player);
    return player;
  }        
  stopJoinTimer(){    
    if(this.joinTimer){        
      clearTimeout(this.joinTimer);      
      this.joinTimer = null;
    }
  }
  stopPlayerTurnTimer(){
    if(this.playerTurnTimer){
      clearTimeout(this.playerTurnTimer);
      this.playerTurnTimer = null;
    }
  }

  playerPlayedValidMove(player,move){//player placed a move
    
    player.updateAllPlayTime();
    const roundModel = this.currentRound.playerPlayed(player, move);    
  }

  /*
   * validates and if everything is ok accept player move    
  */
  newMove(player, move){    
    if(this.isPlayerTurnAndMoveIsValid(player , move)){
      this.stopPlayerTurnTimer();
      this.playerPlayedValidMove(player, move);    
      return true;
    }else{
      return false;
    }
  }
  
  isPlayerTurnAndMoveIsValid(player, move ){      
    if( this.gameState.isPlayerTurn(player.id) &&  
      this.currentRound.turnPlayerId()===player.id && 
      this.isValidMove(move)
    ){ 
      return true; 
    }else{
      return false;
    }
  }

  /**
   * this function can get called by each extended-game super.isValidMove ( for future polymorph)
   * it is good for each type of game(s) to have specific move validation of itself
   * and one needs to add newMoveSchema functionallity to the new-game wants to develop
  */
  newMoveValidation(move){  
    const validationResult  = this.newMoveSchema.validate(move);
    if( validationResult.error)  return false;

    return true;
  }
  

  /*
   * remove player and player-move(in currentRound) and push-back its reserved-color to game-availbale-colors
   * ITS NOT MEANT TO USED for leaving inside playing state/ use concedePlayer instead
  */
  leavePlayer(player){
    // user can leave this game without any consequence : (complete removal )
    this.currentRound.playerLeftInJoinState(player);
    this.availbaleColors.push(player.color);
    this.players= this.players.filter(p => p.userId !== player.userId ); 
  }
  
  /*
    * it does not make player completely removed from current round because player joined the game and its history should be saved in the end
    * in this case round treat player as a loser player
  */
  concedePlayer(player){
    this.currentRound.playerConceded(player);
  } 
  
  stateMap() {
    return this.gameState.getMap();
  }

  /**
   *  mapping players data for client
  **/
  playersForClientMap(){
    const players = [];
    for(const p of this.players){
      players.push(p.inGameMap());
    }
    return players;
  }  
  userIsConnected(userId){
    this.players.foreach((player)=>{
      if(player.userId ===userId) player.isConnected = true;
    })
  }
  
  async createInDb() {
    await this.model.save();
    this.id = this.model._id;
  }
}
module.exports = Game;
