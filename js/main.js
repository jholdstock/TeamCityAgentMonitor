var buildRefreshRate;
var agentRefreshRate = 5000;
var greenMessage;
var showNeverRunBuilds;
var showMutedBuilds;
var showAgents;

var refreshAgents = true;
var refreshBuilds = true;
//refreshAgents = false;
//refreshBuilds = false;

var start = function(items) {
  applyHideCursor(items.hideCursor);
  applyShowAgents(items.showAgents);
  applyShowNeverRun(items.showNeverRun);
  applyShowMuted(items.showMuted);
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
    var msg = $("<div>").addClass("tsm_init tsm_border").html("Getting agent information<span class='dots'><span>.</span><span>.</span><span>.</span></span>");
    var pending = $("<div>").addClass("tsm_gray").attr("id", "tsm_agent_init").append(msg);

    $(".tsm_build_wrapper").before($("<div>").addClass("tsm_agent_wrapper").append(pending));
    downloadAndDisplayAgents();
  }
  else {
    $(".tsm_agent_wrapper").remove();
  }
}

var applyShowNeverRun = function(showNeverRun) {
  showNeverRunBuilds = showNeverRun;
}

var applyShowMuted = function(showMuted) {
  showMutedBuilds = showMuted;
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
      case "showMuted":
        applyShowMuted(newValue);
        break;
      case "showNeverRun":
        applyShowNeverRun(newValue);
        break;
    }
  }
});

var prepareDOM = function() {
  $(document).prop('title', 'TeamCity Status Monitor')
  var msg = $("<div>").addClass("tsm_init tsm_border").html("Getting build information<span class='dots'><span>.</span><span>.</span><span>.</span></span>");
  var pending = $("<div>").addClass("tsm_gray").attr("id", "tsm_build_init").append(msg);
  $("body").empty().append($("<div>").addClass("tsm_build_wrapper").append(pending));
};

prepareDOM();
loadConfig(start);