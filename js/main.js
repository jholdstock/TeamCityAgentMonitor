var buildRefreshRate;
var agentRefreshRate = 5000;
var greenMessage;
var showNeverRunBuilds;
var showAgents;

var refreshAgents = true;
var refreshBuilds = true;
//refreshAgents = false;
//refreshBuilds = false;

var start = function(items) {
  applyHideCursor(items.hideCursor);
  applyShowAgents(items.showAgents);
  applyShowNeverRun(items.showNeverRun);
  applyBuildRefreshRate(items.refreshRate);
  applySuccessMessage(items.successMessage);
  
  downloadAndDisplayBuilds();
}

var applySuccessMessage = function(successMessage) {
  greenMessage = successMessage;
  $(".tsm_success_msg").html(successMessage);
}

var applyBuildRefreshRate = function(refreshRate) {
  buildRefreshRate = refreshRate * 1000;
}

var applyShowAgents = function(showAgents) {
  if (showAgents) {
    $(".tsm_build_wrapper").before($("<div>").addClass("tsm_agent_wrapper"));
    downloadAndDisplayAgents();
  }
  else {
    $(".tsm_agent_wrapper").remove();
  }
}

var applyShowNeverRun = function(showNeverRun) {
  showNeverRunBuilds = showNeverRun;
}

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
    var newValue = changes[key].newValue;
    switch (key) {
      case "refreshRate":
        applyBuildRefreshRate(newValue);
        break;
      case "successMessage":
        applySuccessMessage(newValue);
        break;
      case "hideCursor":
        applyHideCursor(newValue);
        break;
      case "showAgents":
        applyShowAgents(newValue);
        break;
      case "showNeverRun":
        applyShowNeverRun(newValue);
        break;
    }
  }
});

var prepareDOM = function() {
  $(document).prop('title', 'TeamCity Status Monitor')
  $("body").empty().append($("<div>").addClass("tsm_build_wrapper"));
};

prepareDOM();
loadConfig(start);