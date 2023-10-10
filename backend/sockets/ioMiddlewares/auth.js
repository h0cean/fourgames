const tgDataAuth = require('../../tgStuff/webBotAuth');

const auth = async (socket, next) => {
  try{  

    
    if(!socket.handshake.auth.initData)   return next(new Error('no user data'));//this will reject connection with error message echoing to client
    
    const validationResult = await tgDataAuth(socket);
    
    
    return validationResult? next() : next(new Error('not valid user data'))
    
  }catch(e){
    console.log('*** '+ e + '*** connection will be closed by server');
    return next(new Error(e));
  }



  return next();          
};



module.exports = auth;



// const Jwt = require('jsonwebtoken');
//to validate jwt tokens
const  validateToken = (token)=>{
  const verified = Jwt.verify(token, process.env.TOKEN_SECRET); //invalid tokens will throw
  return verified;
}

  /*else if(socket.handshake.headers.cookie){
      
  // socket.handshake.headers.cookie = 'a=abcd';
    console.log(socket.handshake.headers.cookie);process.exit()
    try{
      // hanshake.headers.cookie:
      console.log('lets validate refresh token for client');process.exit()
      let userObject = await User.findByUsername(socket.handshake.headers.cookie);
      if(!userObject){ 
        throw(`user ${socket.handshake.headers.cookie} not found`);
      }else{
        
        socket._isUser = true;
        socket.user_id = userObject.id;
      }

    }catch(e){
      console.log('*** '+ e + '*** connection will be closed by server');
      return next(new Error(e));
    }

  }*/