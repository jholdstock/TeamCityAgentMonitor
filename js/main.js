var body = $("body");
body.empty();
$("<div>").addClass("tsm_wrapper").appendTo(body);

drawAgents = function(agents) {
  $.each(agents, function(index, agent) {
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
  });
};

chrome.runtime.sendMessage({}, function(response) {

  var response = $.ajax({
    url: "http://lon1vci01.int.openbet.com/httpAuth/app/rest/agents",
    headers: { Accept:"application/json" },
    async: false
  });
  var agentIds = JSON.parse(response.responseText).agent;

  var agents = [];
  for (var i = 0; i< agentIds.length; i++) {
    var agentId = agentIds[i].id;

    var agent = $.ajax({
      url: "http://lon1vci01.int.openbet.com/httpAuth/app/rest/agents/id:" + agentId + "",
      headers: { Accept:"application/json" },
      async: false
    });

    agent = JSON.parse(agent.responseText);
    agents.push(agent);
  }
  
  drawAgents(agents);
});