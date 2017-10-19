var couchbase = require('couchbase');
var cluster = new couchbase.Cluster('couchbase://192.168.1.49');
var bucket = cluster.openBucket('dashboard');

bucket.get('key::lum::1250', function(err, result) {
        if (err) throw err;
        console.log(result);
        var jsondoc = result.value;
        sendJson(jsondoc);
        });

function sendJson(data){
  console.log(data.etat);
}
