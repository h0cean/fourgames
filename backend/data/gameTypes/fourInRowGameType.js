/**
 
 * About game Type:
 * game-type is a class contains data about the game ....
 
 * Using for:
 * we can customize details about games, for example we can have multiple for-in-row games by instantiating this class with diffrent
 * rows,colums, eachMoveTime, ...etc 
 * OR we can give user the power to customize games : like number of players (which is limited to min/max players in game-type )
 
 * Diffrent game types:
 * to know diffrence between diffrent games which we dont have yet we used origin placeHolder so 
 * for example: four-in-row-classic and four-in-row-pro are with origin:1
 * and if one wants to develop another game for this platform like x-o,  first needs to generate a new origin for that
 * 
 * about initer field:
 * on instantiate a gameType, we pass a initer and its job is
 *  to create a brand new  game(based on type-origin) 
 *  so for example... 
 *  all diffrent gameTypes of four-in-rows are having same origin
 *  and call  new  on fourInRowGame class
 * 
 * where to find instances? inside /data/gameTypes (instances are hard-coded there)
*/

const GameBoard = require('../../sockets/classes/fourInRowClasses/gameBoard');

class GameType
{
	constructor(id, initer, typeName, columns,rows, eachMoveTime, joinTime, playerTotalTime , creatable  ){
				
		this.origin = 1;
		this.id = id;
		this.initer = initer;
		this.name = typeName;
		this.board = new GameBoard(columns,rows);		
		
				
		this.eachMoveTime = eachMoveTime;
		this.joinTime=  joinTime;
		this.playerTotalTime = playerTotalTime;
		
		this.countDownToStartSeconds = 3;
		this.betweenTurnDelay = 0;
				
		this.minPlayers = 2;
		this.maxPlayers = 4;
	          	
      	//scores for N in a row 
      	this.twoInRowScore  =  5;
 		this.threeInRowScore  =  10;
 		this.fourInRow  =  20;		

	}
}

module.exports = GameType;