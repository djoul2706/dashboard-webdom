from couchbase.bucket import Bucket
from couchbase.n1ql import N1QLQuery
import json
import sys
import time
import urllib2

import logging
from logging.handlers import RotatingFileHandler

def init_logger(logfile,loglevel=logging.WARNING,consolelevel=logging.DEBUG):
	logger = logging.getLogger()

	logger.setLevel(consolelevel)
	formatter = logging.Formatter('%(asctime)s :: %(levelname)s :: %(message)s')

	file_handler = RotatingFileHandler(logfile, 'a', 1000000, 1)
	file_handler.setLevel(loglevel)
	file_handler.setFormatter(formatter)
	logger.addHandler(file_handler)

	stream_handler = logging.StreamHandler()
	stream_handler.setLevel(consolelevel)
	stream_handler.setFormatter(formatter)
	logger.addHandler(stream_handler)

	return logger

def get_doc_from_key(key):
	json_doc = cb.get(key).value
	return json_doc

def update_cb_doc(id,jeedom_status):
	query = N1QLQuery('UPDATE `dashboard` SET etat=$filtre1 WHERE id_etat=$filtre2', filtre1=str(jeedom_status), filtre2=id)
	try:
		result = cb.n1ql_query(query).execute()
	except Exception as error:
		logger.warning('UPDATE error : %s' % error)
		result = cb.n1ql_query(query).execute()

def get_jsons_from_type(type):
	query = N1QLQuery('SELECT * FROM `dashboard` WHERE type=$filtre1', filtre1=type)
	json_liste = cb.n1ql_query(query)
	
	for row in json_liste: 
		cb_status = row["dashboard"]["etat"]
		jeedom_status = get_status(row["dashboard"]["id_etat"])
		id = row["dashboard"]["id_etat"]

		if cb_status != jeedom_status:
			key = 'key::' + type + '::' + row["dashboard"]["id_etat"]
			print(key)
			update_cb_doc(id,jeedom_status)
			logger.info('id : %s => %s' % (id, jeedom_status))

def get_status(id):
	url = "http://192.168.1.49/core/api/jeeApi.php?apikey=YQFCKcxGJ52BSrHCc73U&type=cmd&id="+str(id)
	etat = urllib2.urlopen(url).read()
	return etat
 

## initialisation de l'acces au bucket et du logger
cb = Bucket('couchbase://localhost/dashboard')
logger = init_logger('activity.log',logging.WARNING,logging.DEBUG)

while(1):
	logger.info('comparaison en cours')
	get_jsons_from_type("lum")
	get_jsons_from_type("mode")
	time.sleep(5)


