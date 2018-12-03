dict = [];
chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {	
    	if (details.type == "websocket")
    		handleWebSocket(details)
        dict.push({ key: details.tabId, value: details.requestHeaders });
        //console.log(dict)
      return {requestHeaders: details.requestHeaders};
    },
    {urls: ["<all_urls>"]},
    ["requestHeaders"]
);

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
    for(var i=0;i<dict.length;i++){
        if (dict[i].key === tabId) dict.splice(i,1);
    }
}); 

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    
});

function handleWebSocket(details){

	if (details.initiator.indexOf("http://") != -1 || details.initiator.indexOf("https://") != -1)
		initiatorDomain = extractDomainHttp(details.initiator)
	else if (details.initiator.indexOf("ws://") != -1 || details.initiator.indexOf("wss://") != -1)
		initiatorDomain = extractDomainWss(details.initiator)
	if (details.url.indexOf("http://") != -1 || details.url.indexOf("https://") != -1)
		urlDomain = extractDomainHttp(details.url)
	else if (details.url.indexOf("ws://") != -1 || details.url.indexOf("wss://") != -1)
		urlDomain = extractDomainWss(details.url)
	
	initiatorDomain = getDomainName(initiatorDomain)
	urlDomain = getDomainName(urlDomain)

	if (initiatorDomain != urlDomain){

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  		chrome.tabs.sendMessage(tabs[0].id, {alert: "true"})
		})
	}
}

function extractDomainHttp(url){
	return String(url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/g))
}

function extractDomainWss(url){
	return String(url.match(/^(?:wss?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/g))
}

function getDomainName(url){

	if ((url.match(/\./g)||[]).length == 1)
		return url.substring(url.indexOf("://")+3)
	else{

		arr = url.split('.')
		return arr[arr.length - 2] + "." + arr[arr.length - 1]
	}
}



