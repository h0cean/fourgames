const changeColor = async (socket, color)=>{
	try{
		socket.dbUser.color = color;	
		await socket.dbUser.save();

	}catch(e){
		console.log(e);
	}

}

module.exports = changeColor;