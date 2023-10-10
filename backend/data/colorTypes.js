/**
 *  this module works as static-data-container of
 *  colors used in front-end (player-color)
 */

const Color = require('../sockets/classes/color');
const arrayRandomizer = require('../helper/functions').shuffler;

const allColors = [
	new Color(1,'bg-sky-500'),	//#0ea5e9
	new Color(2,'bg-yellow-400'),	//#facc15
	new Color(3,'bg-green-500'),	//#22c55e
	new Color(4,'bg-red-600'),	//#dc2626
	new Color(5,'bg-purple-500'),	//#a855f7
	new Color(6,'bg-pink-400'),	//#f472b6
];



const getShuffleColors= (howMany)=>{

	if (!howMany) howMany = allColors.length;

	return  arrayRandomizer(allColors.slice(0,howMany) );
	
}

const randomOne = ()=>{
	return allColors[(Math.floor(Math.random() * allColors.length))]
}

const findOneById = (id) => {
 return allColors.find((element) => element.id == id);
 
};



module.exports = {randomIniter : getShuffleColors,randomOne,  all: allColors, findOneById: findOneById }