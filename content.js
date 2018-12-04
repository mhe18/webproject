chrome.runtime.onMessage.addListener(
  function(message, sender) {
    if(message.errors == "CORSinject")
      alertString = "Probable Cross-origin resource sharing. Injection in the header\n" ;
    else if(message.errors == "CORSorigin")
  	  alertString = "Probable Cross-origin resource sharing\n" ;
    alert(alertString)
});