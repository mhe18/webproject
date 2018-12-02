chrome.runtime.onMessage.addListener(
  function(request, sender) {
    alert("Probable Cross Site WebSocket Hijacking")
});