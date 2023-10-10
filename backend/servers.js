let ioInstance = '';
const io = ()=>{
    return ioInstance;
}
const socketIO = require('socket.io');
const expressApp = require('./expressMain').app;
const tgBot = require('./expressMain').tgBot;

const load = (port, address)=>{
    
    console.log('--- express Server started listening and serving statics in public folder! ');
    
    
    ioInstance = socketIO( expressApp.listen(port, address), {
        path:'/api/',
        cors: { 
            origin: "*" 
        }
    });
    console.log('--- socketIO instaniated & using express (listening to  handshakes) ');
    return {io, tgBot };   
 
    
}

module.exports = {
    app: expressApp,
    io: io,
    tg: tgBot,
    load,

};


// helmet = require('helmet'),
//######## using helmet for security
// expressApp.use(helmet());

// expressApp.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             'script-src-attr': null
//         }
//     })
// );// firefox problem