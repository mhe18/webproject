dict = [];
const HEADER_CORS = {
    "accept": "accept",
    "accept-charset": "accept-charset",
    "access-control-request-headers":"access-control-request-headers",
    "access-control-request-method":"access-control-request-method",
    "accept-language": "accept-language",
    "connection":"connection",
    "content-length":"conteent-length",
    "content-language": "content-language",
    "content-type": "content-type",
    "cookie": "cookie",
    "cookie2": "cookie2",
    "date":"date",
    "dnt":"dnt",
    "drp": "drp",
    "downlink": "downlink",
    "expect":"expect",
    "host":"host",
    "keep-alive":"kepp-alive",
    "referer":"referer",
    "te":"te",
    "trailer":"trailer",
    "transfer-encoding":"transfer-encoding",
    "upgrade":"upgrade",
    "save-data": "save-data",
    "viewport-width": "viweport-width",
    "via":"via",
    "width": "width",
    "user-agent": "user-agent",
    "origin": "origin"
}

//whitelist for cross origin website
const WHITE_LIST = [
    "google","twitter","youtube","facebook"
]

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {	
    	if (details.type == "websocket")
    		handleWebSocket(details)
        else if (checkSimpleCORS(details))  {
            console.log(details.type);
            handleSimpleCORS(headers);//check the CORS header
        }
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

//send the wrong message
function sendWrong(errors){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  		chrome.tabs.sendMessage(tabs[0].id, {alert: "true",errors: errors})
		})
}

function returnHeaders(details){
    const type = details.hasOwnProperty('requestHeaders') ? 'request' : 'response';
    var _headers = details[`${type}Headers`];
    var headers={};
    for (let header of _headers) { headers[header.name]= header.value;}
    return(headers);
}

function handleWebSocket(details){

	if (details.initiator.indexOf("http://") != -1 || details.initiator.indexOf("https://") != -1)
		initiatorDomain = extractDomainHttp(details.initiator)
	else if (details.initiator.indexOf("ws://") != -1 || details.initiator.indexOf("wss://") != -1)
		initiatorDomain = extractDomainWss(details.initiator)
	if (details.url.indexOf("http://") != -1 || details.url.indexOf("https://") != -1)
		urlDomain = extractDomainHttp(details.url)
	else if (details.url.indexOf("ws://") != -1 || details.url.indexOf("wss://") != -1)
		urlDomain = extractDomainWss(details.url)

	if (initiatorDomain != urlDomain) 
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  		chrome.tabs.sendMessage(tabs[0].id, {initiatorDomain: initiatorDomain, urlDomain: urlDomain})
	})
}

function titleForSimpleCORS(name) {
    name = name.toLowerCase();
    if (HEADER_CORS.hasOwnProperty(name)){
        return true;
    }
    else {
        return false;
    }
}

//Check whether the CORS request is a simple one
function checkSimpleCORS(details){
    if (details.method != "HEAD" && details.methond != "GET" && details.method != "POST") {
        return false;
    }    // Request methond is HEAD, GET or POST
    
    const type = details.hasOwnProperty('requestHeaders') ? 'request' : 'response';
    var _headers = details[`${type}Headers`];
    var headers={};
    for (let header of _headers) { headers[header.name]= header.value;}
    var headerNames = Object.keys(headers).sort();
    for (let name of headerNames){
        if (!titleForSimpleCORS(name)) {
            return false;
            console.log(name);
            }
        } //Request header values are not customized, except for 9 whitelisted headers in HEADER_CORS
    
    if(headers.hasOwnProperty('Content-Type')){
        if (headers['Content-Type']!= "text/plain" && headers['Content-Type'] != "multipart/form-data" && headers['Content-Type'] != "application/x-form-uri-encoded"){
        return false;
        } //Content-Type header value is one of three specific values
    }
    
    return true;
}

function handleSimpleCORS(headers){
    var regex=/[{}()]/g;
    for (let header of ['Accept','Accept-Language','Content-Language']){
        if (headers.hasOwnProperty(header)){
            if(headers[header].match(regex) != null) sendWrong('CORSinject');
        } //restrict the values of Accept, Accept-Language and Content-Language
    }
    
    var origin=extractDomainHttp(headers['Origin']);
    if (!WHITE_LIST.contains(origin)) sendWrong('CORSorigin');
    //check whether the origin is trusted
}

function extractDomainHttp(url){
	return getDomainName(String(url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/g)))
}

function extractDomainWss(url){
	return getDomainName(String(url.match(/^(?:wss?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/g)))
}

function getDomainName(url){

	if ((url.match(/\./g)||[]).length == 1){
		return url.substring(url.indexOf("://")+3)
    }
	else{

		arr = url.split('.')
		return arr[arr.length - 2] + "." + arr[arr.length - 1]
	}
}



