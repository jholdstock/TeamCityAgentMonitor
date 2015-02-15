var buildRefreshRate = 10000;
var agentRefreshRate = 10000;

var refreshAgents = true;
var refreshBuilds = true;
//refreshAgents = false;
//refreshBuilds = false;

var start = function(items) {
  //alert("Check auth");
  applyHideCursor(items.hideCursor);

  if (items.showAgents) {
    prepareDOM_agents();
    downloadAndDisplayAgents();
  }
  
  buildRefreshRate = items.refreshRate * 1000;
  successMessage = items.successMessage;
  
  downloadAndDisplayBuilds();
}

var prepareDOM = function() {
  $("body").empty().append($("<div>").addClass("tsm_build_wrapper"));
};

var prepareDOM_agents = function() {
  $(".tsm_build_wrapper").before($("<div>").addClass("tsm_agent_wrapper"));
};

var applyHideCursor = function(hideCursor) {
  if (hideCursor) {
    $("body").css("cursor", "none");
  }
  else {
   $("body").css("cursor", "default"); 
  }
};

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

prepareDOM();
loadConfig(start);