var buildRefreshRate;
var agentRefreshRate = 5000;
var greenMessage;
var showNeverRunBuilds;
var showMutedBuilds;
var showingAgents;
var server;

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
  
  for (index in items.servers) {
    if (tcUrl == items.servers[index].url) {
      server = items.servers[index];
    }
  }
  
  downloadAndDisplayBuilds();
}

var applySuccessMessage = function(successMessage) {
  greenMessage = successMessage;
  $("#tsm_success_msg").html(successMessage);
}

var applyBuildRefreshRate = function(refreshRate) {
  buildRefreshRate = refreshRate * 1000;
}

var applyShowAgents = function(newShowAgents) {
  if (newShowAgents & !showingAgents) {
    var msg = $("<div>").addClass("tsm_init tsm_border").html("Getting agent information<span class='dots'><span>.</span><span>.</span><span>.</span></span>");
    var pending = $("<div>").addClass("tsm_gray").attr("id", "tsm_agent_init").append(msg);

    $("#tsm_build_wrapper").before($("<div>").attr("id", "tsm_agent_wrapper").append(pending));
    downloadAndDisplayAgents();
  }
  else {
    $("#tsm_agent_wrapper").remove();
  }
  showingAgents = newShowAgents;
}

var applyShowNeverRun = function(showNeverRun) {
  showNeverRunBuilds = showNeverRun;
}

var applyShowMuted = function(showMuted) {
  showMutedBuilds = showMuted;
}

var applyHideCursor = function(newHideCursor) {
  shouldHideCursor = newHideCursor;
};

var shouldHideCursor;
var justHidden = false;

var j;
$(document).mousemove(function() {
    if (!justHidden) {
        justHidden = false;
        clearTimeout(j);
        $('html').css({cursor: 'default'});
        j = setTimeout(hide, 1000);
    }
});
function hide() {
  if (shouldHideCursor) {
    $('html').css({cursor: 'none'});
  }
  justHidden = true;
  setTimeout(function() {
    justHidden = false;
  }, 500);
}

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
  $("body").empty().append($("<div>").attr("id", "tsm_build_wrapper").append(pending));
  var summaryWrapper = $("<div>").attr("id", "tsm_summary_wrapper");
  var summary = $("<div>").attr("id", "tsm_summary").addClass("tsm_summary_text");
  var clock = $("<div>").attr("id", "tsm_clock").addClass("tsm_summary_text");
  summaryWrapper.append(summary).append(clock);
  $("body").append(summaryWrapper);
};

prepareDOM();

// TODO solve auth problem - when logged out the monitor doesnt work, but loading the projects does
// This is here to try and replicate the working call before startingu p the monitor  - thus auth should not be an issue on load

// $.ajax({
//   url: tcUrl + "/httpAuth/app/rest/projects",
//   headers: { Accept:"application/json", Authorization: "Basic " + tcCreds },
// }).done(function() {
     loadConfig(start);
// });
