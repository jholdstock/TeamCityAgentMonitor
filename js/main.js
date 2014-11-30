var drawAgent = function(agent) {
  var color;
  if (agent.connected) {
    if (agent.enabled) color = "tsm_green";
    else color = "tsm_red";
  } else color = "tsm_gray";

  var topLeft = agent.name;
  var topRight = agent.connected? "Connected" : "Disconnected";
  var bottomLeft = agent.enabled? "Enabled" : "Disabled";
  createOrUpdateElement("tsm_a_" + agent.id, $(".tsm_agent_wrapper"), topLeft, topRight, bottomLeft, "", color)
};

var drawBuild = function(buildType) {
  return function(build) {
    if (build.status != "SUCCESS") {
      var topLeft = buildType.projectName + " :: " + buildType.name;
      var topRight = parseDateString(build.finishDate);
      var bottomLeft = build.status;
      createOrUpdateElement("tsm_b_" + buildType.id, $("div.tsm_build_wrapper"), topLeft, topRight, bottomLeft, build.statusText, "tsm_red");
    }
    else {
      $("div#tsm_b_" + buildType.id).remove();
    }
  };
}

var getBuildDetails = function(buildType) {
  return function(response) {
    $.ajax({
      url: tcUrl + response.build[0].href,
      headers: { Accept:"application/json" },
      success: drawBuild(buildType)
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
  setTimeout(downloadAndDisplayBuilds, 2000);
}

var agentIdCallback = function(response) {
  var agentIds = response.agent;
  for (var i = 0; i < agentIds.length; i++) {
    $.ajax({
      url: tcUrl + agentIds[i].href,
      headers: { Accept:"application/json" },
      success: drawAgent
    });
  }
}

var downloadAndDisplayAgents = function() {
  $.ajax({
    url: tcUrl + "/httpAuth/app/rest/agents",
    headers: { Accept:"application/json" },
    success: agentIdCallback
  });
  setTimeout(downloadAndDisplayAgents, 2000);
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
