  // Create a client instance
  //Example client = new Paho.MQTT.Client("postman.cloudmqtt.com", 34266,"luis.silva@lsdi.ufma.br");
  var port=34733;
  var host="postman.cloudmqtt.com";
  
   client = new Paho.MQTT.Client(host, port, "web_" + parseInt(Math.random() * 100, 10));

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  var options = {
    useSSL: true,
    userName: "gnoyhyfh",
    password: "1fcYKehDxWjH",
    onSuccess:onConnect,
    onFailure:doFail
  }

  // connect the client
  client.connect(options);

  // called when the client connects
  function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
	client.subscribe("mhub/luis.silva@lsdi.ufma.br/service_topic/Location");
	
    message = new Paho.MQTT.Message("Hello CloudMQTT");
    message.destinationName = "Teste";
    client.send(message);
	var txt_pre_definido = document.getElementById('messages').value;
	
	var t= document.getElementById("messages").innerHTML += "<div id='1'>" +"Conectado ao MQTT"+"</div>";
	var t= document.getElementById("messages").innerHTML += "<div id='3'>" +"Tópico Teste Criado</div>";
	var t= document.getElementById("messages").innerHTML += "<div id='4'>" +"Enviando Mensagem ao Tópico: "+""+message.destinationName+"</div>";
	var t= document.getElementById("messages").innerHTML += "<div id='5'>" +"Mensagem do Tópico "+""+message.destinationName+" Recebida</div><br>";
	
	var t= document.getElementById("messages").innerHTML += "<div id='6'>" +"Dados Recebidos do sensor:"+"</div>";
	
  }
	
  function doFail(e){
    console.log(e);
	
        var t= document.getElementById("messages").innerHTML += "<div id='1'>" +"Falha na Conexão"+"</div>";
		var t= document.getElementById("messages").innerHTML += "<div id='2'>" +"Host: "+""+host+"</div>";
		var t= document.getElementById("messages").innerHTML += "<div id='3'>" +"Porta: "+""+port+"</div>";
		        
  }

  // called when the client loses its connection
  //var i = 1;
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
	  var txt_pre_definido = document.getElementById('messages').value;
        var t= document.getElementById("messages").innerHTML += "<div id='4'>" +responseObject.errorMessage+"</div>";
        //i++;
	  
    }
  }

  // called when a message arrives
  var i = 1;
  function onMessageArrived(message) {
    //console.log("onMessageArrived:"+message.payloadString);
	var txt_pre_definido = document.getElementById('messages').value;
        var t= document.getElementById("messages").innerHTML += "<div id='"+i+"'> "+i+" - " + message.payloadString+"</div>";
        i++;
	
  }
  
  
