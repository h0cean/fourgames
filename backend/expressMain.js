const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const tgApp = require('./tgStuff/app');


app = express();
app.use(cors())

app.post( `/${tgApp.path}`,(req, res,next)=>{console.log('express main');next();},
  bodyParser.json(),
  
     tgApp.router
  
);

// Add headers before the routes are defined
/*app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
*/
// app.use(express.static(__dirname + '/public'));

// app.get("*", function (req, res) {
  
//   res.sendFile(__dirname + '/public/index.html');
// });

module.exports = { app,  tgBot: tgApp.botInstance };