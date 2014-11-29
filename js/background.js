var selection;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  sendResponse(selection);
});

chrome.browserAction.onClicked.addListener(function() {
  selection = "http://lon1vci01.int.openbet.com"
  chrome.tabs.create({
    url: selection+"/externalStatus.html"
  });
  
  chrome.tabs.executeScript(null, {file: "vendor/jquery-1.11.1.min.js"});
  chrome.tabs.executeScript(null, {file: "js/main.js"});
	chrome.tabs.insertCSS(null, {file: "css/main.css"});
  
});