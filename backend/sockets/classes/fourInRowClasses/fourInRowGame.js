const Game = require('../game');
const GameStates = require('../GameStates');
const FourInRowRound = require('./fourInRowRound');
const FourInRowPlayer = require('./fourInRowPlayer');
const Colors = require('../../../data/colorTypes');

const gameModel = require('../../mongooseSchemas/fourInRowSchema').mainModel;
const newMoveValidationSchema = require('../../joiSchemas/fourInRowSchema').newMove;

const brandNew = (creator, type, jsonData)=>{
	const state = GameStates.preFlight();
	
	const dbModel = new gameModel({		
		
		registrarUserId: creator.id, 

		registrarName: creator.first_name,		
		originId: type.origin, 
		typeId: type.id,
		typeName: type.name,

		publicId: jsonData.publicId,
		contextType: jsonData.contextType,
		playersCount: jsonData.playersCount,
		state: state.dbMap(),
		
		plays:[],
		players:[],
		boardData:{
			boardColumns: type.board.columns,
			boardRows:type.board.rows
		}

	});
	return new FourInRowGame( {dbModel, type, state} );
}

class FourInRowGame extends Game
{
	constructor(data){
		super(data.dbModel);

    
		this.type = data.type;
		
		this.gameState = data.state; 

    //ids related to game
    this.id = this.model._id;
    this.registrarUserId = this.model.registrarUserId;
    this.publicId = this.model.publicId;
    this.typeName = this.model.typeName;        
    
    this.minPlayers = this.model.minPlayers;
    this.maxPlayers = this.model.maxPlayers;    
		this.gameChannel = `G-${this.registrarUserId}-${this.typeName}-${this.publicId}`; //room channel is : G-${GameName}-${timestamp};
		
		this.newMoveSchema = newMoveValidationSchema;								
		this.maxMoves = this.type.board.columns * this.type.board.rows;
    this.players = [];
	}	
	setFinishEventCallback(cb){
		this.finishCallback = cb;
	}
	setCancelEventCallback(cb){
		this.cancelCallback = cb;
	}
	isValidMove(m){	
		return (this.newMoveValidation(m) && this.validColumnNum(m.col) && this.currentRound.columnHasOneEmptyCell(m.col)  );
	}	
	validColumnNum(n){  	
  	return (n >= 0 && n < this.type.board.columns);
  }  
	canFinish(){
		if((this.maxMoves == this.currentRound.moveCounter)  || (this.currentRound.hasFourInRowPlayer())  || this.currentRound.activePlayers<2){
			return true;
		}

		return false;
	}	
	/*
		this function will be called on new game creation : later we can use multiplae round with few changes on how and where this function calls
	*/
  initNewRound(startTimeMilliSec){

	  this.model.roundNum++;//this line highlihgts the possibility that we can develop for add this.rounds to game class(es) so we can have a multi-round game 
		this.availbaleColors = Colors.randomIniter();

    this.currentRound = FourInRowRound.brandNew( 
    	this.model._id ,
    	this.model.roundNum, 
    	startTimeMilliSec, 
    	this.type.board.columns,
    	this.type.board.rows,
    	this.type.twoInRowScore, 
    	this.type.threeInRowScore,
    	this.type.fourInRow 
    );
  }

  /*
		create new player and assign player, color and avatar ( trying to assign user-preferred  ones)
  */
  newPlayer(tgUser, dbUser){
		const p = FourInRowPlayer.brandNew(tgUser, this.model._id);	
		const playerColor = this.getAvailableColor(dbUser.color);			
		p.setInGameUserData(playerColor, dbUser.avatar);
		this.currentRound.playerJoined(p);			
		this.players.push(p);
		return p;	
	}
	getAvailableColor(preferedColor){
		const index = this.availbaleColors.findIndex(c => c.id ==preferedColor.id);
		
		let playerColor = '';
		if(index > -1){
			//player default color found and available			
			playerColor = this.availbaleColors[index];
			this.availbaleColors.splice(index,1); //reserve a color for player by removing it from availbale-colors of game
			
		}else{
			//player default color is not available			(some other player choose it first)
			playerColor = this.availbaleColors.pop(); //reserve and remove color
		}
		return playerColor;
		
	}
	  
  /**
   * this mapping used for events: 
   * yourCurrentRoom, roomPublicData, gameFinished
   * */
	listMap(){
		return {
			id: this.id, 
			players: this.playersForClientMap(),
			plays: this.currentRound.columnPlays,
			state : this.stateMap(),
			boardData: this.boardMap(),
			typeId: this.getTypeID(), 

			publicId: this.publicId,
			name: this.typeName, 
			playersCount: this.playersCount(),
			turnPlayerIndex: this.currentRound.turnInternalIndex,

			minPlayers: this.getMinPlayers(),
			maxPlayers: this.getMaxPlayers(),			
			

			joinTime:this.getJoinTime(),
			eachMoveTime: this.getEachMoveTime(),
			playerTotalTime: this.getPlayerTotalTime(),			

		}
	}

	/**
	 * game finished and everything is come to an end for this game:
	 * save history record of game 
	 * */
	async conclude(){
    const finalPlays = [];
    //todo : remove this mapping by changing  data structre design( mostly needed to change object-key names)
    for (const cp of this.currentRound.columnPlays){
    	let obj = { rows: [] };
    	for (const row of cp){
    		obj.rows.push(row)
    	}
    	finalPlays.push(obj)
    }
    this.model.plays = finalPlays;    
    
    const finalPlayers = [];
    for(const p of this.players){
      finalPlayers.push( p.inGameMap() );      
    }
    
    this.model.players = finalPlayers;
    await this.model.save();
  }
  boardMap(){
    	return { boardColumns: this.type.board.columns,boardRows: this.type.board.rows};
  }  
	currentScoresMap(){
		let ps = [];
		for(let p of this.players){
			ps.push({playerId: p.id, score: p.score});
		}
		return ps;
	}	
  		
}

module.exports = {class: FourInRowGame, brandNew: brandNew};