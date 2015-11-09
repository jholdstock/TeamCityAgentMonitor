var downloadAndDisplayAgents = function() {
  getAgents(function(response) {
    var agentIds = response.agent;
    for (var i = 0; i < agentIds.length; i++) {
      getFromUrl(agentIds[i].href, agentCallback);
    }
    if ($("#tsm_agent_wrapper").length > 0 && refreshAgents && !handlingError) {
      setTimeout(downloadAndDisplayAgents, agentRefreshRate);
    }
  });
}

var agentCallback = function(agent) {
  $("#tsm_agent_init").remove();
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
 
  drawAgent("tsm_a_" + agent.id, agent.name, status, color);
};