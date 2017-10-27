
var socket = io();
var jsonreq = {"type" : "lum"} ;

window.onload=function() {
 getDate('div_horloge', 'div_date');
 socket.emit('request', jsonreq);
};

socket.on('news', function(data){
    var values = data;
    upSertRubrique(values);
});

socket.on('meteo', function(data){
    var listeJson = data;
//	updateBG(listeJson[0].temp);
	document.getElementById("BGcolor").style.background = getBGcolor(listeJson[0].temp);

	var elem = document.getElementById("hh");
	while (elem.firstChild) { elem.removeChild(elem.firstChild) }

	var elem = document.getElementById("previsions");
	while (elem.firstChild) { elem.removeChild(elem.firstChild) }

	createMeteoCour(listeJson[0]);
	for (i = 1; i < listeJson.length; i++) {
		createMeteoPrev(listeJson[i]);
	}
});	

function getBGcolor(temp){

  switch (true) {
    case (temp<0): return "#4040a1"; // bleu fonce
    case (temp<5): return "#034f84"; //bleu
    case (temp<10): return "#80ced6"; //bleu claire
    case (temp<15): return "#d5f4e6"; //turquoise
    case (temp<20): return "#fefbd8"; //beige 
    case (temp<25): return "#82b74b"; //vert
    case (temp>24): return "#f18973"; //orange 
    default: return "#fefbd8"; //beige
  }
}

function createMeteoCour(meteoJson) {
	var elem = document.getElementById("hh");
	var meteo = document.createElement("div");
	var temp = document.createTextNode(Math.round(meteoJson.temp));
	var icon = document.createElement("I");
	
	icon.className = getIconClass(meteoJson.id) + " fa-2x";
	
	meteo.appendChild(icon);
	meteo.appendChild(temp);
	
	elem.appendChild(meteo) ;
}

function createMeteoPrev(meteoJson) {
	var meteo = document.createElement("div");
	var temp = document.createTextNode(Math.round(meteoJson.temp) + '\n' + meteoJson.dt_txt);
	var icon = document.createElement("I");
	
	icon.className = getIconClass(meteoJson.id) + " fa-1x";
	
	meteo.appendChild(icon);
	meteo.appendChild(temp);
	
	document.getElementById("previsions").appendChild(meteo) ;	
}

function getIconClass(id){
	console.log('id de la meteo = '+id);
	switch (true) {
		case (id<300): return "fa-bolt"; //eclair
		case (id<600): return "fa fa-tint"; //pluie
		case (id<700): return "fa fa-snowflake-o"; //neige
		case (id<800): return "fa fa-cloud"; //nuages
		case (id<900): return "fa fa-sun-o"; //soleil ou lune en fonction de l'heure
		case (id>900): return "fa fa-lightbulb-o"; //eclair
		default: return "fa fa-refresh fa-spin"; //refresh
	}
}

function updateLum(jsondoc, rubrique){
  // changement de l'etat 
  if (jsondoc.etat == "1") { rubrique.className = "elements_on"; }
  else { rubrique.className = "elements_off"; }
  
  rubrique.onclick = function () { 
    if (jsondoc.etat == "1") { socket.emit('urlrequest', jsondoc.id_off ); }
    else { socket.emit('urlrequest', jsondoc.id_on ); }
  }
}

function createLum(jsondoc){
  var rubrique = document.createElement("div");

  rubrique.id = jsondoc.id_etat;
  if (jsondoc.etat == "1") { rubrique.className = "elements_on"; }
  else { rubrique.className = "elements_off"; }

  var textroom = document.createTextNode(jsondoc.room);
  var icon = document.createElement("I");
  icon.className = "fa fa-lightbulb-o fa-5x";
  rubrique.appendChild(icon);
  rubrique.appendChild(textroom);

  rubrique.onclick = function () { 
    if (jsondoc.etat == "1") { socket.emit('urlrequest', jsondoc.id_off ); }
    else { socket.emit('urlrequest', jsondoc.id_on ); }
  }

  document.getElementById("containeur").appendChild(rubrique) ;
}

function upSertRubrique(jsondoc){
  var rubrique = document.getElementById(jsondoc.id_etat) ;
  if (rubrique){
    // le doc est deja utilise par une rubrique, on la met a jour 
    switch (type = jsondoc.type) {
      case "lum":
        updateLum(jsondoc, rubrique);
        break;
      case "mode":
        console.log("type mode non gere pour le moment")
        break;
    }
  } else {
    // le doc n'est pas utilise, on créé une rubrique 
    switch (type = jsondoc.type) {
      case "lum":
        createLum(jsondoc);
        break;
      case "mode":
        console.log("type mode non gere pour le moment")
        break;
    }
  }
}

function getDate(el1,el2) {
  if(typeof el1=="string") { el1 = document.getElementById(el1); }
  if(typeof el2=="string") { el2 = document.getElementById(el2); }
  function actualiser() {
    var monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
    var dayNames = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    var date = new Date();
    var dayIndex = date.getDay();
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    el1.innerHTML = date.getHours()+':'+(date.getMinutes()<10?'0':'')+date.getMinutes();
    el2.innerHTML = dayNames[dayIndex - 1] + ' ' + day + ' ' + monthNames[monthIndex] ; // + ' ' + year;
    }
  actualiser();
  setInterval(actualiser,30000);
}

// appuie sur un bouton du menu de navigation 
function select_mode(linkElement) {
	// modification de la classe des boutons pour mettre en avant le bouton clique
	parent = linkElement.parentNode ;
	if (parent.hasChildNodes())
	{
	var collEnfants = parent.childNodes;
	for (var i = 0; i < collEnfants.length; i++) 
		{
		collEnfants[i].className = "boutons" ;
		}
	}	
	linkElement.className = "bouton_actif";
	
	// execution d'une action en fonction du bouton choisi 
	switch (id = linkElement.id) {
    case "bt-home":
        alert(id);
        break;
    case "bt-hc":
        alert(id);
        break;
    case "bt-lum":
        alert(id);
        break;
    case "bt-alerte":
        alert(id);
		break;
	}
}

