
let io = '';
const JoiSocketSchemas = require('../joiSchemas/mainSchema');
const GameTypeFinder = require('../../data/gameTypes').finder;
const AvatarFinder = require('../../data/userAvatars').findOneById;
const ColorFinder = require('../../data/colorTypes').findOneById;
const FourInRowGameModel = require('../mongooseSchemas/fourInRowSchema').mainModel;

const  User = require('./mongoUser');

const {
  createGame, 
  observeGame, 
  rejoinGame, 
  
  joinAsPlayer,
  leaveGame,
  concedeGame,
  playerPlayed,
  afterSocketJoinedGame,
  changeColor,
  changeAvatar
} = require ("../controllersHub");

/*
	* GLOBAL RULE: IF  (user has player-record.isActive == true ) THEN { cant observe/join/create games }
*/
class GameServer {
  constructor(servers , serverId, name, namespace, staticData, builtInGames) {
    io = servers.io();
    // this.tgBot = servers.tgBot; //not used
    this.id = serverId;
    this.name = name;
    this.namespace = namespace;
    this.types = staticData.gameTypes;
    this.avatars = staticData.avatars;
    this.colors = staticData.colors;

    this.games = [];
    this.users = [];
    this.players = [];
    this.sockets = [];

  }  
    
  
  newConnection(socket) {
    cl('before new connection users.length:', this.users.length);
    //closing older connections of new new connected User as multi-client is not supported 
    
    this.sockets.forEach( (olderSocket)=>{

      if(olderSocket.webBotUser.id === socket.webBotUser.id) {
        olderSocket.manuallyDisconnected = true;
        // olderSocket.webBotUser.playerState.isConnected=true;
        cl('manualy disconnected')
        olderSocket.disconnect();
      }
    });
    this.sockets.push(socket);    
    
    this.syncConnectionData(socket.webBotUser);
    
    this.setupListeners(socket);
    
    this.newConnectionEmits(socket);         
    
    this.users.push(socket.webBotUser);
    
  }

 
  setupListeners(socket){
    // createGameByChosenInlineQuery : we have no create method inside socket 
    socket.on('joinGame', (payLoad, ack) => {  cl('join request')
      this.joinGameById(socket, payLoad, ack);
    });
    socket.on('playerPlay', async (payload, ack) => { cl('player play request')
      await this.userPlayed(socket, payload, ack);
    });
    socket.on('leaveGame', async (payload ,ack)=>{  cl('leave game request')
      await this.leaveCurrentGame(socket,  ack )
    });
    socket.on('changeAvatar',async  (payload, ack)=>{     cl('change avatar request')
      await this.userChangedAvatar(socket, payload ,ack);      
    });
    socket.on('changeColor', async (payload, ack)=>{    cl('change color request')
      await this.userChangedColor(socket, payload, ack);      
    });
    socket.on('observeGame',async (payload, ack) => {   cl('observe request')
      await this.observeGameById(socket, payload, ack);
    });
    socket.on('rejoinGame', (payLoad, ack) => {    cl('rejoin request')
      this.rejoinGamebyId(socket, payLoad, ack);
    });    

     socket.on('disconnect',  (reason) => {  cl(`${ socket.webBotUser.id }! Disconnected`);
      this.userDisconnected(socket);
    });
  }
  /*
		this function works by using players array which is live-array 
    notice this: 
    user cant and shouldnt have a  playing-game and not have its player-link ( which works like a internal token in app)
	*/
  syncConnectionData(user) {
    const player = this.findUserAsPlayer(user);
    user.observingGame = '';
    if (player) {      
      const game = this.findGameByID(player.gameId);
      if (!game){ 
        this.removePlayerFromServer(player);
        throw 'something defienetly went wrong! server games and players are out of sync! user player record found BUT not the game';
      }
      
      user.playerState = player;
      user.currentGame = game;
      player.isConnected = true;
      this.ioOfNS().in(game.gameChannel).emit('playerConnection',{
        userId:user.id,
        isConnected:true
      })
    }else{
      user.currentGame = '';
      user.playerState = '';      
    }
  }

  async newConnectionEmits(socket) {
    
    const data = { 
      user:{
        avatar: socket.dbUser.avatar,
        color: socket.dbUser.color,
        profilePicture:socket.dbUser.profilePicture,
        hasProfilePicture: socket.dbUser.hasProfilePicture,
      },
      types: this.types ,
      colors: this.colors,
      avatars: this.avatars,
      current : this.userLiveData(socket.webBotUser),

      photoPath: `${process.env.BOT_HOST_URL}${process.env.PICS_PATH}`
    };    
    if(socket.tgWebApptStartParam){

      const game = this.findGameByPublicId(socket.tgWebApptStartParam);
      if(game) {
        data.startParamGameId = game.id;
      }else{
        if(socket.tgWebApptStartParam){
          const gameRecordInDb = await FourInRowGameModel.findOne({publicId: socket.tgWebApptStartParam})
          
          if(gameRecordInDb){
            data.startParamGameId = gameRecordInDb._id;
          }else{
            data.startParamGameId = 'canceled';
          }

        }
      }
    }    
    
    
    socket.emit('gameServerData', data);
    
  }
  userLiveData(user) {
    return (user.currentGame) ? { gameId: user.currentGame.id, isPlayer: true } : { isPlayer: false };
  }
  //this function get called by telegram endpoint of server 
  async createGameByChosenInlineQuery(tgUser,dbUser, data, callback){
    try{

      const playerRecord = this.findPlayerByTgId(tgUser.id);
      if(playerRecord) throw('user is player in other games'); //multi device (not supported ) since it cant be done with one clinet of telegram ( being inside inline query and select one result and also being in the socket of mini app )
      
      const validationResult = JoiSocketSchemas.createGameSchema.validate(data);
      if (validationResult.error) throw `create game validation-problem: * ${validationResult.error} `;
      
      const type = GameTypeFinder(data.typeId); //finder throws error  on fail ! (of course we can modify it later, for now its ok )
      const game = type.initer(tgUser , type, data);//this calls brandNew function of game related to type

      await createGame(tgUser, dbUser , game, callback);
      cl('create game state', game.gameState)
      this.games.push(game);      
      this.players.push(tgUser.playerState)
      
      game.setFinishEventCallback(async (eventName, data)=>{
        //game finished called obviously before code reaches this point
        try{
          await this.afterFinishedProcedure(game, eventName, data)

        }catch(e){
          cl(e)
        }
      });

      game.setCancelEventCallback(async (eventName, data )=>{
        try{
          await this.cancelGame(game,eventName, data);

        }catch(e){
          cl(e)
        }

      })
    }catch(e){
      callback(e);
    }
  }


 /**
  * conclude scores and players data in the end of game
  * remove game from live games
  * disconnect sockets from gamechannel
  * */
  async afterFinishedProcedure(game, eventName, data){
    // this.roomCanceledEmits(room);
    await game.conclude();


    this.ioInGame(game, eventName, data);
    this.removeGame(game);
    for (const player of game.players) {

      this.removePlayerFromServer(player);
      let u = this.findUser(player.userId);
      if (u) {        
        u.playerState = '';
        u.currentGame = '';
      }

    }
    this.ioOfNS().in(game.gameChannel).socketsLeave(game.gameChannel);    
  }
  // game canceled  before started (not reached min player)
  async cancelGame(game, eventName, data, socket) {

    this.ioInGame(game, eventName, data);
    
    this.games = this.games.filter( g=> g.id !== game.id );
    game.gameCanceled(eventName);
    
    for (const player of game.players) {
      
      this.removePlayerFromServer(player);
      
      let u = this.findUser(player.userId);
      if (u) {              
        u.currentGame= '';
        u.playerState= '';
      }
    }
    this.ioOfNS().in(game.gameChannel).socketsLeave(game.gameChannel);

    this.removeGame(game);
    const result = await FourInRowGameModel.deleteOne({id:game.id});//
    console.log(`result of delete : `, result)
    console.log(`result of delete : `, this.games.length)

    
  }

  /****************	Observe game ***********************/

  async observeGameById(socket, payload, ack) {    
    try {      
      //observe validation
      const playerRecord = this.findPlayerByTgId(socket.webBotUser.id);
      if(playerRecord) throw('user is player in other games'); 

      const game = this.validateGetGame(payload); //return false on not found and throw on unvalid game id
      if (game) {//its a live game, 
        if (socket.webBotUser.observingGame) {        
            if (socket.webBotUser.observingGame.gameChannel === game.gameChannel) return ;//  already observing the very same game requested
            
            socket.leave(socket.webBotUser.observingGame.gameChannel);
            socket.webBotUser.observingGame = '';
        }
        observeGame(socket, game);
        return ack({ok:true, httpCode:200})
      }else{
        //the game is NOT live (finished or canceled)
        const gameRecordInDb = await FourInRowGameModel.findById(payload.gameId);
        
        if(gameRecordInDb){
          
          return socket.emit('gamePublicData', {
            game: this.gameHistoryMap(gameRecordInDb),
            
          });

        }else{
          cl('not found')
          return ack({ok:false, httpCode:400})

        }
      }
      
    }catch(e){
      cl(`observe error : ${e}`);
    }
  }


  /****************	join Room ***********************/

  joinGameById(socket, data, ack) {    
    try {      
      const game = this.validateGetGame(data); //return false on not found and throw on unvalid game id
      
      if(game){
          if(game.gameState.isBetweenTurns()) return ack({ok:false, httpCode: 429});
          if( !game.canAnyoneJoin() ) return ack({ok:false, httpCode:400});          
          
          const player = this.findPlayerByTgId(socket.webBotUser.id);
          if(player) throw('user is player in other games'); //multi device (not supported )
              
          joinAsPlayer(socket.webBotUser, socket.dbUser, game, ()=>{
            afterSocketJoinedGame(socket, game);                  
          });
          this.players.push(socket.webBotUser.playerState);      
          return ack({ok:true, httpCode:200})
      }else{

        return ack({ok:false, httpCode:400});
      }
      //else{ could be edge case to handle }
      
    } catch (e) {
      cl('****** join room procedure error catcher *** ' + e); //todo log to file
    }
  }

 

  /**************** play in Room ***********************/
  async userPlayed(socket, d, ack) {
    const theGame = socket.webBotUser.currentGame;
    try {  
      if(!theGame) return ack({ok:false, httpCode:400});      
      //some actions need to be done first and after that client should retry:
      if(theGame.gameState.isBetweenTurns()) return ack({ok:false, httpCode: 429});

      if(theGame.isPlaying() && socket.webBotUser.playerState){
        const validationResult = JoiSocketSchemas.newMoveSchema.validate(d);
        if (validationResult.error) {
          throw `new move general validation error: * ${validationResult.error} `;
        }
        await playerPlayed(socket, d.move ,ack); //this line can throw on not logically valid move
      }else{
         return ack({ok:false, httpCode: 400});
      }
      
    } catch (e) {
      cl(e);
    }
  }
  
  /****************	Rejoin Room ***********************/
  rejoinGamebyId(socket, data, ack) {    
    cl('** rejoinGamebyId **');
    try {
      if(!socket.webBotUser.currentGame) throw('player have no game to rejoin');//could be an edge case
      const game = this.validateGetGame(data); //return false on not found and throw on unvalid game id
      
      if (!game) return ack({ok:false, httpCode:400});
      
      if(socket.webBotUser.currentGame.id !== game.id) throw('user is not in that game to rejoin( but user IS in 1 other game) ')
      rejoinGame(socket, game);      
      
    } catch (e) {
      cl('** rejoin problem catcher ');
      cl(e);
    }
  }

  async leaveCurrentGame(socket ,ack){
    try{
      const theGame = socket.webBotUser.currentGame;

      if(!theGame) return ack({ok:false, httpCode:400});

      // in between turns.... some actions need to be done first and after that client should retry
      // if(theGame.gameState.isBetweenTurns()) return ack({ok:false, httpCode: 429});

      if(theGame.gameState.isJoinState()){
        //its a leave 
        const lastJoinState = theGame.gameState;
        // theGame.stateToDelayBetweenTurn();

        await leaveGame(socket);

        this.removePlayerFromServer(socket.webBotUser.playerState);
        socket.webBotUser.playerState = '';
        socket.webBotUser.currentGame = '';
        return ack({ok:true});

      }else if(theGame.gameState.isPlaying()){
        //its a concede

        const lastPlayingState = theGame.gameState;        

        await concedeGame(socket);

        this.removePlayerFromServer(socket.webBotUser.playerState);
        socket.webBotUser.playerState = '';
        socket.webBotUser.currentGame = '';
        return ack({ok:true})

      }else {
        return ack({ok:false, httpCode: 400})
      }
      

    }catch(e){
      cl(e);
    }
  }
  

  /*
   * optimize solution: we can move the userSockets which we (as backend) disconnected  programmatically , like the older connections of user
   * updating online status if user involved in any on-going game
  */
  userDisconnected(socket) {
    
    try{
      if(socket.manuallyDisconnected) cl('catched manual dc');
      const user = socket.webBotUser;
      // const player = this.findUserAsPlayer(user);
      this.sockets = this.sockets.filter( (s)=>{
        if(s.webBotUser.id !== socket.webBotUser.id){        
          return true;              
        }else{        
          if(s.webBotUser.currentGame){
            s.webBotUser.playerState.isConnected = false;

            s.to(s.webBotUser.currentGame.gameChannel).emit('playerConnection',{
              userId: s.webBotUser.id,
              isConnected:false
            });
            return false;
          }
        }      
      })

      this.users = this.users.filter( (u) => u.id !== user.id );

      cl(`* after dc user length: ${this.users.length}`);
      cl(`* after dc SOckets length: ${this.sockets.length}`);

    }catch(e){
      cl('something went wrong');
    }
  }
  async userChangedColor(socket, payload , ack){
    try{
      const validationResult = JoiSocketSchemas.changeUserColorSchema.validate(payload);
      if (validationResult.error)  throw `change color validation-problem: * ${validationResult.error} `;
      const color = await ColorFinder(payload.id);
      if(!color) throw('color id not found');
      await changeColor(socket, color);
      return ack({ok:true});

    }catch(e){
      cl(e);

    }
  }

  async userChangedAvatar(socket, payLoad, ack){
    try{
      const validationResult = JoiSocketSchemas.changeUserAvatarSchema.validate(payLoad);
      if (validationResult.error) {
        throw `change avatar validation-problem: * ${validationResult.error} `;
      }
      const avatar = await AvatarFinder(payLoad.id);
      changeAvatar(socket, avatar);
      return ack({ok:true});

    }catch(e){
      cl('** change avatar problem catcher ');
      cl(e);
    }
  }
  


  validateGetGame(d) {
    const validationResult = JoiSocketSchemas.findRoomByIdSchema.validate(d);
    if (validationResult.error) {
      throw `find room schema problem: * ${validationResult.error} `;
    }    
    return this.findGameByID(d.gameId);
    
  }
  findUser(userId) {
    return this.users.find((u) => u.userId === userId);
  }
  findPlayerByTgId(userId){
    
    return this.players.find((o) => o.userId === userId);
  }

  findUserAsPlayer(user) {
    return this.findPlayerByTgId(user.id);
  }

  findGameByID(roomID) {
    return this.games.find((r) => r.id == roomID);
  }
  findGameByPublicId(gamePublicId){
    return this.games.find((r) => r.publicId === gamePublicId ); 
  }  
  
  
  removePlayerFromServer(player) {
    this.players =  this.players.filter(function (p) {
      return p.userId !== player.userId;
    });
  }

  removeGame(game) {
    this.games = this.games.filter(function (r) {
      return r.id !== game.id;
    });
  }

  ioOfNS() {
    return io.of(this.namespace);
  }

  ioInGame(g, eventName, payLoad) {
    return this.ioOfNS().in(g.gameChannel).emit(eventName, payLoad);
  }
  
  gameHistoryMap(gameRecordInDb){
    
    const mappedState=  {
      gameStateId: gameRecordInDb.state.id,
      name: gameRecordInDb.state.name,
      desc: gameRecordInDb.state.description,
      exp: gameRecordInDb.state.exp,
      since: gameRecordInDb.state.createdAt, 
  
    };

    return {
      id:gameRecordInDb.id,
      
      plays: gameRecordInDb.plays, 
      players: gameRecordInDb.players, 
      boardData: gameRecordInDb.boardData, 
      typeId:gameRecordInDb.typeId,
      state: mappedState
    }
  }
  
  
}

function cl(t) {
  console.log(t);
}



module.exports = GameServer;

