var drawAgent = function(agent) {
  var agentElement = $("div#tsm_a_" + agent.id);

  if (agentElement.length > 0) {
    var bgElement = agentElement;
    var name = $("div.tsm_topLeft", agentElement);
    var connected = $("div.tsm_topRight", agentElement);
    var enabled = $("div.tsm_bottomLeft", agentElement);
  }
  else {
    var bgElement = $("<div>").attr("id", "tsm_a_" + agent.id);
    var name = $("<div>").addClass("tsm_topLeft");
    var connected = $("<div>").addClass("tsm_topRight");
    var enabled = $("<div>").addClass("tsm_bottomLeft");
    bgElement.append(name).append(enabled).append(connected);
    $("div.tsm_agent_wrapper").append(bgElement);
  }

  var color;
  if (agent.connected) {
    if (agent.enabled) {
      color = "tsm_green";
    }
    else {
      color = "tsm_red";
    }
  }
  else {
    color = "tsm_gray";
  }

  name.html(agent.name);
  connected.html(agent.connected? "Connected" : "Disconnected");
  enabled.html(agent.enabled? "Enabled" : "Disabled");
  bgElement.removeClass().addClass(color);
};

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

var drawBuild = function(buildType) {
  return function(response) {
    var build = response.build[0];
    if (build.status != "SUCCESS") {
      var bgElement = $("<div>").attr("id", "tsm_b_" + build.id);
      var name = $("<div>").addClass("tsm_topLeft");
      var status = $("<div>").addClass("tsm_topRight");
      bgElement.append(name).append(status);
      $("div.tsm_build_wrapper").append(bgElement);
      name.html(buildType.projectName + " :: " + buildType.name);
      status.html(build.status);
      bgElement.removeClass().addClass("tsm_red");
    }
  };
}

var buildTypesCallback = function(response) {
  var buildTypes = response.buildType;
  console.log(response);
  for (var i = 0; i < buildTypes.length; i++) {
    $.ajax({
      url: tcUrl + "/httpAuth/app/rest/builds/?locator=count:1,canceled:false,running:false,buildType:id:" + buildTypes[i].id,
      headers: { Accept:"application/json" },
      success: drawBuild(buildTypes[i])
    });
  }
}

var downloadAndDisplayBuilds = function() {
  $.ajax({
    url: tcUrl + "/httpAuth/app/rest/buildTypes",
    headers: { Accept:"application/json" },
    success: buildTypesCallback
  });
  //setTimeout(downloadAndDisplayBuilds, 2000);
}

var downloadAndDisplayAgents = function() {
  $.ajax({
    url: tcUrl + "/httpAuth/app/rest/agents",
    headers: { Accept:"application/json" },
    success: agentIdCallback
  });
  setTimeout(downloadAndDisplayAgents, 2000);
}

var tcUrl = "http://lon1vci01.int.openbet.com";
var body = $("body");
body.empty();
$("<div>").addClass("tsm_agent_wrapper").appendTo(body);
$("<div>").addClass("tsm_build_wrapper").appendTo(body);

chrome.runtime.sendMessage({}, function(response) {
  downloadAndDisplayAgents();
  downloadAndDisplayBuilds();
});
