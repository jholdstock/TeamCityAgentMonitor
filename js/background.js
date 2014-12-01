var tcUrl;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  sendResponse({tcUrl:tcUrl});
});

chrome.browserAction.onClicked.addListener(function() {
  tcUrl = "http://lon1vci01.int.openbet.com";
  chrome.tabs.create({
    url: tcUrl+"/externalStatus.html"
  });
  chrome.tabs.insertCSS(null, {file: "css/main.css"});
  chrome.tabs.executeScript(null, {file: "vendor/jquery-1.11.1.min.js"});
  chrome.tabs.executeScript(null, {file: "js/helpers.js"});
  chrome.tabs.executeScript(null, {file: "js/datetime.js"});
  chrome.tabs.executeScript(null, {file: "js/main.js"});
  
  // if ($(a)[1].text.search("Log in to TeamCity") == 0) {
  //   alert("Please log in to TeamCity and try again. Click \"Remember me\" to see this message less often");
  //   chrome.tabs.create({
  //     url: $("#url").val()
  //   });
  //   exit();
  // } 

});