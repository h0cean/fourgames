/*
	this class contain game round data for all players, logic to findout which player ...etc
	we can move all this data and logic in game-class if all the games in this mini-game-platform would be a one round
	this class highlight the possibility of multi round games
*/

class FourInRowRound{
	constructor(gameId,  number,  startTimeMs, columns, rows ,twoS, threeS, fourS ){
		this.gameId = gameId;
		this.roundNumber = number;
		this.startTimeMs = startTimeMs;
		
		this.boardColumns = columns;
		this.boardRows = rows;
		this.twoInRowScore = twoS;
		this.threeInRowScore = threeS;
		this.fourInRow = fourS;

		this.fourInRowPlayerID = -1;
		this.moveCounter = 0
		this.turnInternalIndex = 0;
		this.moves = [];
	}


	/**
	 * init emoty coulmns
	 * set active players( participant entered this round)
	*/
	readyToRun(){
		this.columnPlays = [];
		for (let i = 0; i < this.boardColumns; i++) {
			this.columnPlays.push([]);
		}	
		this.activePlayers = this.moves.length;
	}
	itsFirstTurn(){
		this.turnInternalIndex = 0;
	}

	//this function should call after validation of move
	playerPlayed(player, newPlay){
		const move = this.findUserMove(player.userId);
		if(move){
			newPlay.row = this.columnPlays[newPlay.col].length;
			this.calculateScores(player, move, newPlay);
			this.columnPlays[newPlay.col].push(player.id);
			move.plays.push(newPlay);
			this.moveCounter++;

		}
	}
	//has some one won	the game by four pieces In a row?
	hasFourInRowPlayer(){
		return (this.fourInRowPlayerID!==-1)
	}
	playerJoined(player){
		this.moves.push({
			userId :  player.userId,
			playerId :  player.id,
			plays:[],
			playerScore:0 ,
			hasLeft: false,
			isWinner:false
		});
	}
	playerConceded(player){
		const index = this.moves.findIndex(m => m.userId ==player.userId);
		const move = this.moves[index];
		if(!move.hasLeft ){ //seems like this is un-neccessory todo : check
			move.hasLeft = true;
			player.hasLeft = true
			this.activePlayers --;			
		}	
	}
	playerLeftInJoinState(player){
	
		this.moves =  this.moves.filter(function(m) {
		  return m.userId !== player.userId;
		});
	}
	
	findUserMove(userId){
		const m = this.moves.find(pm=> pm.userId=== userId);
		if (m) return m;
		
		return false;	
	}

	crawlBoardForScore(rightStep, upStep ){		
		return  this.recursiveCrawlToGetDepth(rightStep, upStep, 0);
	}
	recursiveCrawlToGetDepth(r, u ,totalStep){
		//the point we are viewing the board from in the moment( its a recursive func and total step will ++ in each loop)
		let povX = (totalStep * r) + this.theJUSTmove.col; 
		let povY = (totalStep * u) + this.theJUSTmove.row;
		
		//on step forward in direction of right: (-1,0,+1) & up: (-1,0,+1)
		let rightStep =    povX +  r ;
		let upStep    = povY +  u ;

		if( this.hasCol(rightStep) &&this.hasRow(upStep) &&  this.hasColRowFilled(rightStep, upStep) && this.columnPlays[rightStep][upStep] ===this.turnPlayerId()){
			// console.log(this.columnPlays[x][y]);
			totalStep++;
			return this.recursiveCrawlToGetDepth(r ,u ,totalStep);
		}else{

			return totalStep;
		}
		
	}
	hasColRowFilled(x, y){
		return (this.columnPlays[x].length> y);
	}
	hasCol(c){
		return ( c >= 0 && c < this.boardColumns);
	}
	columnHasOneEmptyCell(n){
  		return (this.columnPlays[n].length < this.boardRows)
 	}
	/*
		this method thinks it already has a righter
	*/
	hasRow(r){
		return ( r >= 0 && r < this.boardRows);
	}

	calculateScores(player, move, m){
		this.theJUSTmove = m;			
		// logically this should always be zero ;) think about the game logic:
		// let northScore = this.crawlBoardForScore(0,1); no need to calculate this direction!!! guess why?
		
		const eastScore = this.crawlBoardForScore(1,0);
		const westScore = this.crawlBoardForScore(-1,0);
		const southScore = this.crawlBoardForScore(0,-1);
		const neScore = this.crawlBoardForScore(1,1);
		const swScore = this.crawlBoardForScore(-1,-1);
		const nwScore = this.crawlBoardForScore(-1,1);
		const seScore = this.crawlBoardForScore(1,-1);
		

		const depthArray = [];
		const xDepth = westScore+eastScore+1;
		const yDepth = southScore + 1;
		const neswDepth = neScore + swScore+1;
		const nwseDepth = nwScore + seScore+1;
				
		depthArray.push(xDepth);
		depthArray.push(yDepth);
		depthArray.push(neswDepth);
		depthArray.push(nwseDepth);

		for(let d of depthArray){
			let plusScore = 0;
			if(d>1 && d<4){
				switch(d) {
				  case 2:
				    plusScore = this.twoInRowScore;
				    break;
				  case 3:
				    plusScore =this.threeInRowScore;
				    break;
				}
			}else{
				if(d>3){
					plusScore = this.fourInRow;
				    this.fourInRowPlayerID = move.playerId;
				    player.hasFourInRowPoint = true;
				}
			}
			move.playerScore = move.playerScore+ plusScore;
			player.score = move.playerScore;
		}
	}
	itsNextTurn(){
		this.turnInternalIndex = this.findNextTurn();
	}	
    findNextTurn(){    	
    	let toCheck = this.turnInternalIndex;    
    	for (let i = 0; i < this.moves.length-1; i++) {    		
    		if( toCheck == (this.moves.length-1)){ 
				toCheck = 0;
			}else{ 
    			toCheck ++;
    		}    		
    		if(this.canBeNextTurn(toCheck)) return toCheck;

    	}
    	throw('cant find next turn')
    	
    	
    }
    turnTimerExpired(player){    	
    	player.hasLeft = this.moves[this.turnInternalIndex].hasLeft = true;
    	this.activePlayers --;

    }
    canBeNextTurn(i){    	
    	if(this.moves[i].hasLeft){
    		return false;
    	}
    	return true;
    }
    
	turnPlayerId(){
		return this.moves[this.turnInternalIndex].playerId;
	}
}

const brandNew =  (gameID,  roundNumber, startTimeMs, columns, rows ,twoS, threeS, fourS )=>{
		
	return   new FourInRowRound(gameID  , roundNumber,  startTimeMs,columns, rows ,twoS, threeS, fourS );
	
}


module.exports = { brandNew : brandNew};