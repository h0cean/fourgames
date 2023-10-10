/*
 * these are gameTypes allowed to be created by users 
 * (you can file more comments at the end of this file)
*/
const all = []; //all-types
const fourInRowType = require('./gameTypes/fourInRowGameType');
const brandNewFourInRow = require('../sockets/classes/fourInRowClasses/fourInRowGame').brandNew;

const fourInRowType1 = new fourInRowType(1 , brandNewFourInRow, 'fourInRow-classic',   10,  8, 6000, 180, 3000000, true);

const fourInRowType2 = new fourInRowType(2 , brandNewFourInRow, 'fourInRow-pro',    4,  8, 20, 60, 300, true);


all.push(fourInRowType1, fourInRowType2);

const findById = (typeID) => {
  const e = all.find((element) => element.id == typeID);
  if (e) return e;
  throw 'finding type id problem!';
};

module.exports = {
  finder: findById,
  types: all,
  creatables: all,
};

/*
 ** origins are the games we develop (the very game in nature):
 *
 ** from origins, diffrent possible `type of game-types` can b created( staticly or dynamicly by user-input)
 *  
 ** origin-ids are hard-coded into each gameType inside its contructor, 
 * since they cant be dynamic in nature( no new origin can be made without new game-development ) 
*/