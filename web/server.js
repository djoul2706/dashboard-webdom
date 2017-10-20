var path = require('path');
var express = require("express");
var app = express();
var server = require('http').Server(app);
var PythonShell = require('python-shell');

var couchbase = require('couchbase');
var cluster = new couchbase.Cluster('couchbase://192.168.1.49');
var bucket = cluster.openBucket('dashboard');
var N1qlQuery = couchbase.N1qlQuery;

var io = require('socket.io').listen(server);

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

app.use(express.static('public'));
app.get("/", function(req, res) {
   res.sendFile('./index.html');
 });

io.on('connection', function (socket) {

  socket.on('request', function (data) {
    query = N1qlQuery.fromString('SELECT * FROM dashboard WHERE type="' + data.type + '"');
    bucket.query(query, function(err, rows, meta) {
      if (err) throw err;
      for (row in rows) {
        socket.emit('news', rows[row].dashboard);
      }
    });
  });

  socket.on('urlrequest', function (data) {
    theurl = 'http://192.168.1.49/core/api/jeeApi.php?apikey=YQFCKcxGJ52BSrHCc73U&type=cmd&id=' + data; 
    httpGetAsync(theurl, function(data) {
      console.log(new Date().toISOString() + ' requete url jeedom ok', data);
    });
    refreshCB();
    setTimeout(function(){ 
      console.log(new Date().toISOString() + ' demande refresh couchbase de l id ' + data);
      query = N1qlQuery.fromString('SELECT * FROM `dashboard` WHERE ANY id IN OBJECT_VALUES(`dashboard`) SATISFIES id = ' + data + ' END');
      bucket.query(query, function(err, rows, meta) {
        if (err) throw err;
        for (row in rows) {
          socket.emit('news', rows[row].dashboard);
        }
      }); 
    }, 2000);
  });
   
function getJsonMeteo(){
  query = N1qlQuery.fromString('SELECT prevision.dt, prevision.main.temp, prevision.weather[0].description, prevision.weather[0].id, prevision.dt_txt' +
' FROM `dashboard` as d unnest d.list as prevision LIMIT 4');
  bucket.query(query, function(err, rows, meta) {
	console.log(rows);
    //if (err) throw err;
    socket.emit('meteo', rows);
  });
}
getJsonMeteo();
setInterval(getJsonMeteo,900000);

});   

server.listen(45678);

function httpGetAsync(theUrl, callback) { //theURL or a path to file
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var data = httpRequest.responseText;  //if you fetch a file you can JSON.parse(httpRequest.responseText)
            if (callback) {
                callback(data);
            }                   
        }
    };
    httpRequest.open('GET', theUrl, true); 
    httpRequest.send(null);
}

function refreshCB() {
  PythonShell.run('./../dashboard.py', {args: ['force']}, function (err) {
    //if (err) throw err;
    console.log(new Date().toISOString() + ' demande refresh python');
  });
}

