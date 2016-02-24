var express = require('express');
var mongoose = require('mongoose');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

mongoose.connect("mongodb://127.0.0.1:27017/test-chat");

var ChatSchema = mongoose.Schema({
  created: Date,
  content: String
});

var Chat = mongoose.model('Chat', ChatSchema);

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

/*||||||||||||||||||||||||||||||||||||||ROUTES||||||||||||||||||||||||||||||||||||||*/
app.get('/', function(req, res) {
  res.sendfile('index.html');
});



app.get('/msg', function(req, res) {
   Chat.find().exec(function(err, msgs) {
      res.json(msgs);
  });
});

/*||||||||||||||||||||||||||||||||||||||END ROUTES||||||||||||||||||||||||||||||||||||||*/

/*||||||||||||||||||||||||||||||||||||||SOCKET||||||||||||||||||||||||||||||||||||||*/
io.on('connection', function(socket) {
  socket.on('new user', function(data) {
    socket.join();
    io.emit('user joined', data);
  });

  socket.on('new message', function(data) {
    var newMsg = new Chat({
      username: data.username,
      content: data.message,
      created: new Date()
    });
    newMsg.save(function(err, msg){
      io.emit('message created', msg);
    });
  });
});
/*||||||||||||||||||||||||||||||||||||||END SOCKETS||||||||||||||||||||||||||||||||||||||*/

server.listen(2016);
console.log('2016 port is OK');
