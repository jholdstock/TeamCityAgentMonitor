var agentCallback = function(agent) {
  var color;
  if (agent.connected) {
    if (agent.enabled) color = "tsm_green";
    else color = "tsm_red";
  } else color = "tsm_gray";

  var connected = agent.connected? "Connected" : "Disconnected";
  var enabled = agent.enabled? "Enabled" : "Disabled";
  var status = connected + "<br>" + enabled;
  drawAgent(agent.id, agent.name, status, color);
};

var buildCallback = function(buildType) {
  return function(build) {
    if (build.status != "SUCCESS") {
      var name = buildType.projectName + " :: " + buildType.name;
      var date = parseDateString(build.finishDate);
      var status = build.status;
      drawBuild(buildType.id, name, date, status, build.statusText);     
    }
    else {
      removeElementIfExists(buildType.id);
    }
  };
}

var getBuildDetails = function(buildType) {
  return function(response) {
    $.ajax({
      url: tcUrl + response.build[0].href,
      headers: { Accept:"application/json" },
      success: buildCallback(buildType)
    });
  }
}

var buildTypesCallback = function(response) {
  var buildTypes = response.buildType;
  for (var i = 0; i < buildTypes.length; i++) {
    $.ajax({
      url: tcUrl + "/httpAuth/app/rest/builds/?locator=count:1,canceled:false,running:false,buildType:id:" + buildTypes[i].id,
      headers: { Accept:"application/json" },
      success: getBuildDetails(buildTypes[i])
    });
  }
}

var downloadAndDisplayBuilds = function() {
  $.ajax({
    url: tcUrl + "/httpAuth/app/rest/buildTypes",
    headers: { Accept:"application/json" },
    success: buildTypesCallback
  });
  setTimeout(downloadAndDisplayBuilds, 3000);
}

var agentIdCallback = function(response) {
  var agentIds = response.agent;
  for (var i = 0; i < agentIds.length; i++) {
    $.ajax({
      url: tcUrl + agentIds[i].href,
      headers: { Accept:"application/json" },
      success: agentCallback
    });
  }
}

var downloadAndDisplayAgents = function() {
  $.ajax({
    url: tcUrl + "/httpAuth/app/rest/agents",
    headers: { Accept:"application/json" },
    success: agentIdCallback
  });
  setTimeout(downloadAndDisplayAgents, 3000);
}

var tcUrl;
var body = $("body");
body.empty();
$("<div>").addClass("tsm_agent_wrapper").appendTo(body);
$("<div>").addClass("tsm_build_wrapper").appendTo(body);

chrome.runtime.sendMessage({}, function(response) {
  tcUrl = "http://lon1vci01.int.openbet.com";
  downloadAndDisplayAgents();
  downloadAndDisplayBuilds();
});
