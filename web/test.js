var couchbase = require('couchbase');
var cluster = new couchbase.Cluster('couchbase://192.168.1.49');
var bucket = cluster.openBucket('dashboard');
var N1qlQuery = couchbase.N1qlQuery;
datett = { datetime: new Date().getTime() };
dt = new Date().getTime() ;
console.log(datett);
console.log(dt.toLocaleString());
var type = "lum"
query = N1qlQuery.fromString('SELECT * FROM dashboard WHERE type="' + type + '"');
console.log(query);
/*
bucket.query(query, function(err, rows, meta) {
  if (err) throw err;
  console.log(rows);
  console.log(rows[0].dashboard.etat);
  for (row in rows) {
    console.log(rows[row].dashboard.etat);
  }
});
*/
var n = Date.now();
console.log(n);
var d = new Date();
//var n = d.toLocaleString();
console.log(d);

function actualiser() {
  var monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
  var dayNames = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  var date = new Date();
  var dayIndex = date.getDay();
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  el1 = date.getHours()+':'+(date.getMinutes()<10?'0':'')+date.getMinutes();
  el2 = dayNames[dayIndex - 1] + ' ' + day + ' ' + monthNames[monthIndex] ; // + ' ' + year;
  console.log(el1,el2);
}

actualiser();
