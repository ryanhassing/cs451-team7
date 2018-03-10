var WebSocket = require('ws');

// create socket
const connection = new WebSocket('ws://10.250.9.50:4567/checkers');

// connection opened
connection.addEventListener('open', function(event) {
  connection.send('Connected.');

});

connection.onopen = function() {
  connection.send('Connected.');
}

connection.onerror = function(error) {
  console.log(error);
}

connection.onmessage = function(event) {
  console.log('Message: ', event.data);
}

// once connection is opened, we can do stuff
if (connection.readyState == 1) {
  connection.send("hi");
  connection.send("hi2");
}
