from couchbase.bucket import Bucket
from couchbase.n1ql import N1QLQuery
import json
import sys
import time
import urllib2

import datetime
import logging
from logging.handlers import RotatingFileHandler

def get_meteo():
	url = "http://api.openweathermap.org/data/2.5/forecast?id=6451962&APPID=07e0644af02b3de81df96ca4878f469b&units=metric"
	response = urllib2.urlopen(url)
	meteoJson = json.load(response)  
	return meteoJson

def upsert_meteo(meteoJson):
	key = 'key::meteo'
 	cb.upsert(key, meteoJson)

cb = Bucket('couchbase://localhost/dashboard?operation_timeout=5')

while(1):
	upsert_meteo(get_meteo())
	time.sleep(1800)
