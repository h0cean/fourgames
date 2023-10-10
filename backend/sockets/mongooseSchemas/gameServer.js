
const mongoose  = require('../../servers').dbServer
// console.log(mongoose.connection);
// process.exit();
const serverSchema = new mongoose.Schema({

		id: Number, 
		
		name: String, 

		endpoint: String 

		},{
			methods:
			{
				
				findMe(callBack){
					return mongoose.model('gameServer').find({ id: this.id}, callBack); 
				}
			},
		 	statics: {
			    
			    findByTheID(id) {
			      return this.findById({ id:id  });
		    	}	
			}
		}
	);





module.exports = serverSchema;