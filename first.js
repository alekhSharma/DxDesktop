var sfdx = require('sfdx-node');
var express = require('express');

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const PORT = process.env.PORT || 3000
const path = require('path')



io.on('connection', function(){ /* … */ });


app()
.use(express.static(path.join(__dirname, 'public')))
.get('/', (req, res) => res.render('index'))



app.use(express.static(__dirname+'/public'));



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

server.listen(3000);
