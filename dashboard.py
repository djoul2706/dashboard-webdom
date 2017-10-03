from couchbase.bucket import Bucket
from couchbase.n1ql import N1QLQuery
import json
import sys
import time
import urllib2

## initialisation
cb = Bucket('couchbase://localhost/dashboard')

def get_cb_doc(category="defaut", liste="courses"):
	json_doc = cb.get('lum_timot').value

def update_cb_doc(id,jeedom_status):
	print(id,jeedom_status)
	query = N1QLQuery('UPDATE `dashboard` SET etat=$filtre1 WHERE id_etat=$filtre2', filtre1=str(jeedom_status), filtre2=id)
	result = cb.n1ql_query(query).execute()
	print(result)

def get_jsons_from_type(type):
	query = N1QLQuery('SELECT * FROM `dashboard` WHERE type=$filtre1', filtre1=type)
	json_liste = cb.n1ql_query(query)
	for row in json_liste: 
		cb_status = row["dashboard"]["etat"]
		jeedom_status = get_status(row["dashboard"]["id_etat"])
		id = row["dashboard"]["id_etat"]
		if cb_status != jeedom_status:
			update_cb_doc(id,jeedom_status)
			print("doc updated")
			time.sleep(1)

def get_status(id):
	url = "http://192.168.1.49/core/api/jeeApi.php?apikey=YQFCKcxGJ52BSrHCc73U&type=cmd&id="+str(id)
	etat = urllib2.urlopen(url).read()
	return etat
 
while(1):
	get_jsons_from_type("lum")
	time.sleep(5)

