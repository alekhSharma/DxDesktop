var sfdx = require('sfdx-node');

var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('../..')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on('time', function(){
        sfdx.auth.webLogin({
              setdefaultdevhubusername: true,
              setalias: 'HubOrg'
          }).then(function(){
            console.log('inside command');
            console.log(sfdx.org.list());
            return sfdx.auth.webLogin();
          })
      })
});



    

