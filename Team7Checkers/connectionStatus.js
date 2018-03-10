var WebSocket = require('ws');
var BSON = require('bson');
var bson = new BSON();

// create socket
const connection = new WebSocket('ws://10.250.9.50:4567/checkers');

// connection.onopen = function() {
//   // connection.send('Connected.');
// }
// '{"msg": "connected"}';

connection.onerror = function(error) {
  console.log(error);
}

connection.onmessage = function(event) {
  console.log(event.data);

  // console.log('Message: ', event.data.move[0]);
  // if (event.data)
}

// once connection is opened, we can do stuff
// if (connection.readyState == 1) {
//   connection.send("hi");
//   connection.send("hi2");
// }
