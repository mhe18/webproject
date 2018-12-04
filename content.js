chrome.runtime.onMessage.addListener(
  function(request, sender) {
  	alertString = "Probable Cross Site WebSocket Hijacking\n Current Page Domain: " + request.initiatorDomain +"\n Requested Domain: " + request.urlDomain
    alert(alertString)

});