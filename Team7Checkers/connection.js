var WebSocket = require('ws');

// create socket
const connection = new WebSocket('ws://10.250.9.50:4567/checkers');

// connection opened
connection.addEventListener('open', function(event) {
  connection.send('Connected.');
});

// log message
connection.addEventListener('message', function(event) {
  console.log('Message: ', event.data);
});

// create connection from initial info: username and server ip
var connectFromInit = function(username, ip) {
  var url = 'ws://' + ip + ':4567/checkers';
  const connection = new WebSocket(url);

  // connection opened
  connection.addEventListener('open', function(event) {
    connection.send(username + 'connected.');
  });

  // log messages
  // connection.addEventListener('message', function(event) {
  //   console.log('Message: ', event.data);
  // });

  // assume all messages will be moves of the form below
  connection.addEventListener('message', function(event) {
    var data = JSON.parse(event.data);
    var user = data[0];

    // we don't have to do anything if this player made the move
    if (username != user) {
      var pieceID = data[1];
      var boxID = data[2];

      // make the move based on this info
    }
  });
}

// connectFromInit('player1', '10.250.9.50');

var moveJSON = function(piece, box) {
  return JSON.stringify([piece.piecePlayer, piece.id, box.id, box.pos]);
}
