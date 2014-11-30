var drawAgent = function(agent) {
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

  agent.connected = agent.connected? "Connected" : "Disconnected";
  agent.enabled = agent.enabled? "Enabled" : "Disabled";

  var name = $("<div>").html(agent.name).addClass("tsm_topLeft");
  var connected = $("<div>").html(agent.connected).addClass("tsm_topRight");
  var enabled = $("<div>").html(agent.enabled).addClass("tsm_bottomLeft");

  var bgElement = $("<div>").addClass(color);
  bgElement.append(name).append(enabled).append(connected);
  $("div.tsm_wrapper").append(bgElement);
};

var agentIdCallback = function(response) {
  var agentIds = response.agent;

  for (var i = 0; i< agentIds.length; i++) {
    var agentId = agentIds[i].id;
    $.ajax({
      url: "http://lon1vci01.int.openbet.com/httpAuth/app/rest/agents/id:" + agentId + "",
      headers: { Accept:"application/json" },
      success: drawAgent
    });
  }
}

var body = $("body");
body.empty();
$("<div>").addClass("tsm_wrapper").appendTo(body);

chrome.runtime.sendMessage({}, function(response) {
  $.ajax({
    url: "http://lon1vci01.int.openbet.com/httpAuth/app/rest/agents",
    headers: { Accept:"application/json" },
    success: agentIdCallback
  });
});
