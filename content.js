chrome.runtime.onMessage.addListener(
  function(request, sender) {
  	if (request.alert = "http")
  		alertString = request.errors
  	else
  		alertString = "Probable Cross Site WebSocket Hijacking\n Current Page Domain: " + request.initiatorDomain +"\n Requested Domain: " + request.urlDomain
    
    alert(alertString)

});