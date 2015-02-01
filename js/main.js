var buildRefreshRate = 10000;
var agentRefreshRate = 10000;
var queueRefreshRate = 2000;

var refreshAgents = true;
var refreshBuilds = true;
var refreshQueue = true;
//refreshAgents = false;
//refreshBuilds = false;
//refreshQueue = false;

var prepareDOM = function() {
  $("body").empty().append([
    $("<div>").addClass("tsm_agent_wrapper"),
    $("<div>").addClass("tsm_build_wrapper")
  ]);
  var queueElement = $("<div>").addClass("tsm_black");
  queueElement.append([
    $("<div>").addClass("tsm_queue_label").html("Queue Length"),
    $("<div>").addClass("tsm_queue_count").html("0")
  ]);
  $("div.tsm_agent_wrapper").append(queueElement);
}();

var applyHideCursor = function(hideCursor) {
  console.log(hideCursor);
  if (hideCursor) {
    $("body").css("cursor", "none");
  }
  else {
   $("body").css("cursor", "default"); 
  }
}

loadConfig(function(items) {
  buildRefreshRate = items.refreshRate * 1000;
  successMessage = items.successMessage;
  applyHideCursor(items.hideCursor);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    switch (key) {
      case "refreshRate":
        buildRefreshRate = storageChange.newValue * 1000;
        break;
      case "successMessage":
        successMessage = storageChange.newValue;
        break;
      case "hideCursor":
        applyHideCursor(storageChange.newValue);
        break;
    }
  }
});

downloadAndDisplayQueue();
downloadAndDisplayAgents();
downloadAndDisplayBuilds();