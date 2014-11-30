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
    $("div.tsm_wrapper").append(bgElement);
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

  for (var i = 0; i< agentIds.length; i++) {
    var agentId = agentIds[i].id;
    $.ajax({
      url: tcUrl + "/httpAuth/app/rest/agents/id:" + agentId + "",
      headers: { Accept:"application/json" },
      success: drawAgent
    });
  }
}

var downloadAndDisplayAgents = function(url) {
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
$("<div>").addClass("tsm_wrapper").appendTo(body);

chrome.runtime.sendMessage({}, function(response) {
  downloadAndDisplayAgents();
});
