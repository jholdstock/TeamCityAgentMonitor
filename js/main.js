var agentCallback = function(agent) {
  var connected = agent.connected;
  var enabled = agent.enabled;
  var status = "";
  var color = "tsm_green";

  if (enabled && !connected) {
    color = "tsm_gray";
    status = "Disconnected";
  }
  else if (!enabled && connected) {
    color = "tsm_red";
    status = "Disabled";
  }
  else if (!enabled && !connected) {
    color = "tsm_orange";
    status = "Disconnected<br>Disabled";
  }
 
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

var ajaxGet = function(url, callback) {
  $.ajax({
    url: tcUrl + url,
    headers: { Accept:"application/json" },
    success: callback
  });
}

var getBuildDetails = function(buildType) {
  return function(response) {
    ajaxGet(response.build[0].href, buildCallback(buildType));
  }
}

var buildTypesCallback = function(response) {
  var buildTypes = response.buildType;
  for (var i = 0; i < buildTypes.length; i++) {
    ajaxGet("/httpAuth/app/rest/builds/?locator=count:1,canceled:false,running:false,buildType:id:" + buildTypes[i].id,
     getBuildDetails(buildTypes[i]));
  }
}

var agentIdsCallback = function(response) {
  var agentIds = response.agent;
  for (var i = 0; i < agentIds.length; i++) {
    ajaxGet(agentIds[i].href, agentCallback)
  }
}

var downloadAndDisplayBuilds = function() {
  ajaxGet("/httpAuth/app/rest/buildTypes", buildTypesCallback);
  setTimeout(downloadAndDisplayBuilds, 3000);
}

var downloadAndDisplayAgents = function() {
  ajaxGet("/httpAuth/app/rest/agents", agentIdsCallback);
  setTimeout(downloadAndDisplayAgents, 3000);
}

var body = $("body");
body.empty();
$("<div>").addClass("tsm_agent_wrapper").appendTo(body);
$("<div>").addClass("tsm_build_wrapper").appendTo(body);

downloadAndDisplayAgents();
downloadAndDisplayBuilds();