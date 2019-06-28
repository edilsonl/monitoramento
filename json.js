// Cria uma instancia cliente
var port=34733;
var host="postman.cloudmqtt.com";

client = new Paho.MQTT.Client(host, port, "web_" + parseInt(Math.random() * 100, 10));

// Retorno das Chamadas
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

var options = {
useSSL: true,
userName: "gnoyhyfh",
password: "1fcYKehDxWjH",
onSuccess:onConnect,
onFailure:doFail
}

// Conecta o cliente
client.connect(options);

// Chamada quando o cliente 
function onConnect() {

// Subscribe dos Tópicos.
console.log("onConnect");
client.subscribe("mhub/luis.silva@lsdi.ufma.br/service_topic/Location");
client.subscribe("mhub/luis.silva@lsdi.ufma.br/service_topic/Velocidade");

}

function doFail(e){

	console.log(e);
	var t= document.getElementById("messages").innerHTML += "<div id=falha>" +"Falha na Conexão!"+"</div>";

}

function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0) {
		console.log("onConnectionLost:"+responseObject.errorMessage);
		var txt_pre_definido = document.getElementById('messages').value;

		if (responseObject.errorMessage == "AMQJS0004E Ping timed out."){
			var t= document.getElementById("messages").innerHTML += "<div id=falha>Falha na Conexão! Tempo Excedido</div>";
		}
	}
}

// called when a message arrives
var pintura_parado = [];
var pintura_andando = [];
var pintura_correndo = [];
var pintura = [];
var map;
var valores;
var time_atual = 0;
var valor;
var aux = [];
var i = 0;
var w = 0;
var k = 0;
var inicio_parado = 0;
var inicio_andando = 0;
var inicio_correndo = 0;


var path_parado = [];
var path_andando = [];
var path_correndo = [];

function onMessageArrived(message) {

	var obj = JSON.parse(message.payloadString.replace(/\bNaN\b/g, "null"));

	pintura.push({lat: obj.sourceLocationLatitude, lng: obj.sourceLocationLongitude},);

	if (obj.serviceName == "Velocidade") {
		valor = parseFloat(obj.serviceValue).toFixed(4);
		//document.getElementById("velocidade").innerHTML = "<h1 id='velocidade'> " + valor + " m/s </h1>";
		
		if (valor <= 0.45) {
			document.getElementById("boneco").src = "img/parado.png";
			document.getElementById("messages").innerHTML += "<div style='color:green'> " + "PARADO" + "</div>";
			document.getElementById("velocidade").innerHTML = "<h3 id='velocidade' style='color:green'> " + valor + " m/s </h3>";
		}
		else if (valor > 1.8) {
			document.getElementById("boneco").src = 'img/correndo.png';
			document.getElementById("messages").innerHTML += "<div style='color:red'> " + "CORRENDO" + "</div>";
			document.getElementById("velocidade").innerHTML = "<h3 id='velocidade' style='color:red'> " + valor + " m/s </h3>";
		} 
		else {
			document.getElementById("boneco").src = 'img/andando.png';
			document.getElementById("messages").innerHTML += "<div style='color:yellow'> " + "ANDANDO" + "</div>";
			document.getElementById("velocidade").innerHTML = "<h3 id='velocidade' style='color:yellow'> " + valor + " m/s </h3>";
		}
		
	} else if (obj.serviceName == "Location") {
		if (valor <= 0.45) {
			pintura_parado.push({lat: obj.sourceLocationLatitude, lng: obj.sourceLocationLongitude},);
			i++;
			if (i == 5) {
				for(var j=inicio_parado; j <= pintura_parado.length-1; j++){
					path_parado.push(pintura_parado[pintura_parado.length-1]);
					inicio_parado = pintura_parado.length-1;
				}
				i = 0;
				atualiza();
				pintura.push(pintura_correndo[pintura_correndo.length-1]);
			}
		}
		else if (valor > 1.8) {
			pintura_correndo.push({lat: obj.sourceLocationLatitude, lng: obj.sourceLocationLongitude},);
			w++;
			if (w == 5) {
				for(var j=inicio_correndo; j <= pintura_correndo.length-1; j++){
					path_correndo.push(pintura_correndo[inicio_correndo]);
					path_correndo.push(pintura_correndo[pintura_correndo.length-1]);
					inicio_correndo = pintura_correndo.length-1;
				}
				w = 0;
				atualiza();
				pintura.push(pintura_correndo[pintura_correndo.length-1]);
			}

		}
		else {
			pintura_andando.push({lat: obj.sourceLocationLatitude, lng: obj.sourceLocationLongitude},);
			k++;
			if (k == 5) {
				for(var j=inicio_andando; j <= pintura_andando.length-1; j++){
					path_andando.push(pintura_andando[inicio_andando]);
					path_andando.push(pintura_andando[pintura_andando.length-1]);
					inicio_andando = pintura_andando.length-1;
				}
				k = 0;
				atualiza();
				pintura.push(pintura_andando[pintura_andando.length-1]);
			}
		}		
	}
	//atualiza();
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {zoom: 25, center: pintura, mapTypeId: 'terrain'});	
}

function atualiza(){
	var movimentos = [path_parado, path_andando, path_correndo];

   	var coloracao_andando = new google.maps.Polyline({
      path: movimentos[1],
      geodesic: true,
      strokeColor: '#FFFF00',
      strokeOpacity: 1.0,
      strokeWeight: 15
   	});

   	var coloracao_correndo = new google.maps.Polyline({
      path: movimentos[2],
      geodesic: true,  
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 10
   	});

   	for(var i = 0; i < path_parado.length-1; i++){
        marker = new google.maps.Marker({
            position: path_parado[i],
            center: path_parado[i],
            map: map,		
            title: path_parado[i][0]
        });
        map.setCenter(path_parado[i]);
 
   	}

   coloracao_andando.setMap(map);
   coloracao_correndo.setMap(map);
}