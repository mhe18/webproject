dict = [];
chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
            dict.push({ key: details.tabid, value: details.requestHeaders });
            console.log(dict)
          return {requestHeaders: details.requestHeaders};
        },
        {urls: ["<all_urls>"]},
        ["requestHeaders"]);
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
    
}); 

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    
});
    