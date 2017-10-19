var path = require('path');
var express = require("express");
var app = express();
var server = require('http').Server(app);
var couchbase = require('couchbase');
var cluster = new couchbase.Cluster('couchbase://192.168.1.49');
var bucket = cluster.openBucket('dashboard');
var io = require('socket.io').listen(server);

app.use(express.static('public'));
 app.get("/", function(req, res) {
   res.sendFile('index.html');
 });

io.on('connection', function (socket) {
  socket.on('request', function (data) {

    if (data.type == "lum") {
      bucket.get('key::lum::1250', function(err, result) {
        if (err) throw err;
        socket.emit('news', result.value);
        });
      };

  });
});

server.listen(45678);
