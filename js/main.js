var buildRefreshRate;
var agentRefreshRate = 5000;
var greenMessage;

var refreshAgents = true;
var refreshBuilds = true;
//refreshAgents = false;
//refreshBuilds = false;

var start = function(items) {
  //alert("Check auth");
  applyHideCursor(items.hideCursor);
  applyShowAgents(items.showAgents);
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
  refreshAgents = showAgents;
  if (showAgents) {
    $(".tsm_build_wrapper").before($("<div>").addClass("tsm_agent_wrapper"));
    downloadAndDisplayAgents();
  }
  else {
    $(".tsm_agent_wrapper").remove();
  }
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
    }
  }
});

var prepareDOM = function() {
  $(document).prop('title', 'TeamCity Status Monitor')
  $("body").empty().append($("<div>").addClass("tsm_build_wrapper"));
};

prepareDOM();
loadConfig(start);