console.log('! FourInRow Player module loaded')
const crypto = require('crypto');
const playerModel = require('../../mongooseSchemas/fourInRowSchema').playerModel;
// this is where ALL the data is stored about a given player

/**
 * this class is actually a user data container which lives  after user-disconnection  
 * it also can works as two way binding data mechanism between the game and the gameserver
 * user get an instance of this class on joining any game and that 
 * */
class Player{
    // constructor( username, gameID,isActive =true,  isConnected = true){
    constructor(model , isActive, isConnected){
        this.setData(model)

        this.isActive = isActive;
        this.isConnected = isConnected;
    }

    setData(d){
        this.id = d.id;
        this.userId  = d.userId;
        this.gameId  = d.gameId;
        this.firstName = d.firstName;

        this.allPlayTime = d.allPlayTime;
        this.score = d.score;    
        this.hasFourInRowPoint = d.hasFourInRowPoint;
        this.hasLeft = d.hasLeft;
        
        // this.winAmount = d.winAmount;
        this.model = d; //its a mongoose model !
    }
    setInGameUserData(color, avatar){

        this.color = color;
        this.avatar = avatar;

    }
    //main object to we return for a player to client in many situations
    inGameMap() {
    
        return {
          userId: this.userId,
          playerId: this.id,
          firstName:this.firstName,
          isActive: this.isActive,
          isConnected: this.isConnected,
          
          color: this.color,
          avatar:this.avatar,
          allPlayTime: this.allPlayTime,
          score: this.score,
          hasFourInRowPoint : this.hasFourInRowPoint,
          hasLeft: this.hasLeft
          
        };
    }

    updateAllPlayTime(){
        let now = Math.round( ( (new Date().getTime())/1000 ));
        this.allPlayTime = this.allPlayTime + (now - this.startedPlayingAt );
    }

}


const brandNew =  (tgUser, gameId)=>{
    let n = Math.round((new Date().getTime())/1000);

    const model = new playerModel({
        id : crypto.randomUUID(),
        userId:tgUser.id,
        gameId: gameId,
        firstName:tgUser.first_name,        
    });
    
    let p =  new Player(model,  true, true);    

    return p;
}


/*const fetchByUser = async (id, gameId)=>{
    
    let result =  await playerModel.findOne({userId:id, gameId : gameId});

    if(result){
        let p = new Player(result);
        return p;
    }


}*/

module.exports = { brandNew: brandNew, class: Player};