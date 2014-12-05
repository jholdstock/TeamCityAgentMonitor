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
 
  drawAgent("tsm_" + agent.id, agent.name, status, color);
};

var buildCallback = function(buildType) {
  return function(build) {
    if (build.status != "SUCCESS") {
      var name = buildType.projectName + " :: " + buildType.name;
      var date = parseDateString(build.finishDate);
      var status = build.status;
      drawFailedBuild("tsm_" + buildType.id, name, date, status, build.statusText);
    }
    else {
      $("#tsm_" + buildType.id).remove();
    }
  };
}

var getBuildDetails = function(buildType) {
  return function(response) {
    ajaxGet(response.build[0].href, buildCallback(buildType));
  }
}

var downloadAndDisplayBuilds = function() {
  ajaxGet("/httpAuth/app/rest/buildTypes", function(response) {
    var buildTypes = response.buildType;
    for (var i = 0; i < buildTypes.length; i++) {
      ajaxGet("/httpAuth/app/rest/builds/?locator=count:1,canceled:false,running:false,buildType:id:" + buildTypes[i].id,
       getBuildDetails(buildTypes[i]));
    }
    setTimeout(downloadAndDisplayBuilds, 3000);
  });
}

var downloadAndDisplayAgents = function() {
  ajaxGet("/httpAuth/app/rest/agents", function(response) {
    var agentIds = response.agent;
    for (var i = 0; i < agentIds.length; i++) {
      ajaxGet(agentIds[i].href, agentCallback)
    }
    setTimeout(downloadAndDisplayAgents, 3000);
  });
}

var downloadAndDisplayQueue = function() {
  ajaxGet("/httpAuth/app/rest/buildQueue", function(response) {
    var queue = response.build;
    var length = 0; 
    if (queue !== undefined) {
      length = queue.length;
    }
    
    $(".tsm_centre").html(length);
    setTimeout(downloadAndDisplayQueue, 1500);
  });
}

var body = $("body");
body.empty();
$("<div>").addClass("tsm_agent_wrapper").appendTo(body);
$("<div>").addClass("tsm_build_wrapper").appendTo(body);

var bgElement = $("<div>").attr("id", "tsm_queue").addClass("tsm_black");
var label = $("<div>").addClass("tsm_top").html("Queue Length");
var centre = $("<div>").addClass("tsm_centre").html("0");
bgElement.append(label).append(centre);
$("div.tsm_agent_wrapper").append(bgElement);

downloadAndDisplayQueue();
downloadAndDisplayAgents();
downloadAndDisplayBuilds();