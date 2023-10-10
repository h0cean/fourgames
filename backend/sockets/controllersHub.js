// const  = require('./controllers');
const countdownTimeExpired  = require('./controllers/countdownTimeExpired');
const createGame  = require('./controllers/createGame');
const gameToCountdownState  = require('./controllers/gameToCountdownState');
const gameToJoinState = require('./controllers/gameToJoinState');
const joinAsPlayer  = require('./controllers/joinAsPlayer');
const leaveGame =  require('./controllers/leaveGame');
const concedeGame =  require('./controllers/concedeGame');
const afterSocketJoinedGame  = require('./controllers/afterSocketJoinedGame');
const joinTimeExpired  = require('./controllers/joinTimeExpired');
const observeGame = require('./controllers/observeGame');
const rejoinGame = require('./controllers/rejoinGame');
const playerPlayed = require('./controllers/playerPlayed')

const  changeColor = require('./controllers/changeColor');
const  changeAvatar = require('./controllers/changeAvatar');



module.exports = {
	createGame,
	observeGame,
	rejoinGame,
	joinAsPlayer,
	leaveGame,
	concedeGame,
	afterSocketJoinedGame,
	playerPlayed,
		
	countdownTimeExpired,
	gameToCountdownState,
	gameToJoinState,
	joinTimeExpired,

	changeColor,
	changeAvatar

}