
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

