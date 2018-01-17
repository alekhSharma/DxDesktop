var sfdx = require('sfdx-node');
var http = require('http');
var express = require('express');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname+'/public'));
app.get('/',function(req,res,next){
  res.sendfile(__dirname+'/public/index.html');
})

// list of scratch orgs
var list_of_orgs = sfdx.org.list();
list_of_orgs
  .then(function list_of_sOrg(data){
    return data; 
  }); 


io.on('connection', function(client) {  

   console.log('Client connected...');

      
      client.on('clicked', function() {
        var list_of_orgs = sfdx.org.list();
        list_of_orgs
          .then(function(data){       
                  //send a message to ALL connected clients
                  console.log('inside list');
                  io.emit('buttonUpdate', data);
              });
          });

       client.on('ModelList', function() {
        var list_of_orgs = sfdx.org.list();
        list_of_orgs
          .then(function(data){       
                  //send a message to ALL connected clients
                  console.log('inside list');
                  io.emit('ListData', data);
                  console.log(data);
              });
          });

      client.on('createOrg',function(){
          sfdx.org.open({
            targetusername : 'alekh.newdx@cognizant.com'
          }).then(function(){
            console.log('org open');
            io.emit('Org created','org created');
          });
      });

    
      client.on('OpenOrg', function()
      {
          //authorize a dev hub
          sfdx.auth.webLogin({
              setdefaultdevhubusername: true,
              setalias: 'HubOrg'
          })
          .then(function(){
            console.log('Source pushed to scratch org');  
          });
      })
});

//when a client connects, do this
server.listen(3000, function(){
  console.log('listening on *:3000');
})



