var body = $("body");
body.empty();
$("<div>").addClass("tsm_wrapper").appendTo(body);

getAgentsFromPage = function(page) {
  var agents = [];
  page = $(page);

  var table = $("div#agentsTable tr.agentRow--1", page).each(function(index, row) {
    var name = $(".buildAgentName a", row).text();
    var enabled = $(".agentStatus span.agent", row).text();
    var disconnectTime = $(".lastActivity span.date", row).text();
    agents.push({name:name, enabled:enabled, disconnectTime:disconnectTime});
  });

  drawAgents(agents);
};

drawAgents = function(agents) {
  $.each(agents, function(index, agent) {
    var color;
    if (!agent.disconnectTime.trim()) {
      agent.disconnectTime = "Connected";
      if (agent.enabled == "Enabled") {
        color = "tsm_green";
      }
      else {
        color = "tsm_red";
      }
    }
    else {
      agent.disconnectTime = "Disconnected on " + agent.disconnectTime;
      color = "tsm_gray";
    }

    var name = $("<div>").html(agent.name).addClass("tsm_topLeft");
    var enabled = $("<div>").html(agent.enabled).addClass("tsm_bottomLeft");
    var disconnectTime = $("<div>").html(agent.disconnectTime).addClass("tsm_topRight");

    var bgElement = $("<div>").addClass(color);
    bgElement.append(name).append(enabled).append(disconnectTime);
    $("div.tsm_wrapper").append(bgElement);
  });
};

chrome.runtime.sendMessage({}, function(response) {
  $.get("http://lon1vci01.int.openbet.com/agents.html", null, getAgentsFromPage);
  $.get("http://lon1vci01.int.openbet.com/agents.html?tab=disconnectedAgents", null, getAgentsFromPage);
});