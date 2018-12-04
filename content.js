chrome.runtime.onMessage.addListener(
  function(request, sender) {
  	console.log(request)
  	if(request.alert == "CORSinject")
      alertString = "Probable Cross-origin resource sharing. Injection in the header\n" ;
    else if(request.alert == "CORSorigin")
  	  alertString = "Probable Cross-origin resource sharing\n" ;
  	else if (request.alert == "wss"){
  		console.log(request.initiatorDomain)
  		alertString = "Probable Cross Site WebSocket Hijacking\n Current Page Domain: " + request.initiatorDomain +"\n Requested Domain: " + request.urlDomain
  	}
    alert(alertString)

});