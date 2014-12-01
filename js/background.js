var tcUrl, user, pass;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  sendResponse({tcUrl:tcUrl, username:user, password:pass});
});

chrome.browserAction.onClicked.addListener(function() {
  // tcUrl = "http://lon1vci01.int.openbet.com";
  // user = "admin";
  // pass = "password";
  // chrome.tabs.create({
  //   url: tcUrl+"/externalStatus.html"
  // });
  // chrome.tabs.insertCSS(null, {file: "css/main.css"});
  // chrome.tabs.executeScript(null, {file: "vendor/jquery-1.11.1.min.js"});
  // chrome.tabs.executeScript(null, {file: "js/helpers.js"});
  // chrome.tabs.executeScript(null, {file: "js/datetime.js"});
  // chrome.tabs.executeScript(null, {file: "js/main.js"});
});