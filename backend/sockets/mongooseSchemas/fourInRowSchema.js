const mongoose = require('../../data/mongooseConn').mongoose;

const gameStateSchema = require('./gameStateSchema');

const columnPlays = new mongoose.Schema({
  rows:[String]
})

const playerHistory = new mongoose.Schema({
  playerId:{
    type: String, 
    required:true
  },
  userId:{
    type:Number,
    required: true
  },
  firstName:{
    type:String,
    required:true
  },
  color:{
    id:Number,
    tailwind:String,    
  },
  avatar:{
    id: String,
    photoPath:String
    
  },
  allPlayTime: {
    type: Number,
    required:true
  },
  score:{
    type:Number,
    required:true
  },
  hasLeft: {
    type: Boolean,
    default: false
  },
  hasFourInRowPoint: {
    type: Boolean,
    default: false
  }


})
const roundMovePlaySchema = new mongoose.Schema({
  col: { type:Number, required: true},
  row: { type:Number, required: true}

})
const roundMoveSchema = new mongoose.Schema({
  userId: { type: Number, 
    index: true , 
    required: true
  }, 
  playerId: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'fourInRowPlayer', 
    required:true
  },
  plays: [ roundMovePlaySchema ],  
  playerScore: {type: Number, 
    default: 0 
  },  
  isWon:{type:Boolean, 
    default:false
  }
});

const playerSchema = new mongoose.Schema({
  
  userId: {type:Number, 
    required:true, 
    index:true
  },
  gameId: { type:mongoose.Schema.Types.ObjectId, 
    ref: 'FourInRowGame',
    required:true
  },
  firstName: { type:String, 
    required:true 
  },
  allPlayTime : {type:Number, 
    default: 0
  },

  // score and rematch vote will be reset in every round- so these 2 fields data always holding the data related to last round
  score: {type:Number, default:0},  
  hasFourInRowPoint: {type: Boolean, default: false},
  hasLeft: {type:Boolean ,default: false}

});

/*const roundSchema = new mongoose.Schema({
  // id : {type: Number, index: true},
  gameId: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'FourInRowGame' ,
    required: true

  },
  roundNumber: {type: Number, required: true},    
  moves: [roundMoveSchema],
  
});*/

const fourInRowSchema = new mongoose.Schema({
  plays:[columnPlays],
  players:[playerHistory],
  boardData:{
    boardColumns:Number,
    boardRows:Number
  },
  
  // ids related to game  
  registrarUserId: { type: Number,
    index:true, 
    required:true
  },
  registrarName: String,
  originId: { type: Number,     
    required:true
  },
  typeId: { type: Number, 
    required:true
  },
  typeName: String, 

  publicId: { type: String, 
    required:true,
    index:true
  },
  
  contextType: { type: String,  
    enum:[ 'sender','private', 'group', 'supergroup', 'channel'], 
    required:true
  },
  playersCount:{
    type:Number,
    required:true
  },
  state: {type: gameStateSchema , 
    required: true
  },
  createdAt: {type: Date,
    required: true,
    default: Date.now
  },
  
  roundNum: { type: Number,
    default: 0 
  },
  // moves: [roundMoveSchema],
  
  
});

const fourInRow = mongoose.model('FourInRowGame', fourInRowSchema);

// const roundModel = mongoose.model('FourInRowRound', roundSchema);

const playerModel = mongoose.model('FourInRowPlayer', playerSchema);

module.exports = {
  mainModel: fourInRow,
  // roundModel: roundModel,
  playerModel: playerModel,
};
