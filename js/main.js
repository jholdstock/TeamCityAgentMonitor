var body = $("body");
body.empty();
$("<div>").addClass("tsm_wrapper").appendTo(body);

chrome.runtime.sendMessage({}, function(response) {
  var h = $.get("http://lon1vci01.int.openbet.com/agents.html", null, function(data){
    var agents = [];
    data = $(data);

    var table = $("div#agentsTable tr.agentRow--1", data).each(function(index, row) {
      var name = $(".buildAgentName a", row).text();
      var enabled = $(".agentStatus span.agent", row).text();

      agents.push({name:name, enabled:enabled});
    });

    $.each(agents, function(index, agent) {
      var bgElement = $("<div>").addClass("tsm_green");
      var name = $("<div>").html(agent.name).addClass("tsm_topLeft");
      var enabled = $("<div>").html(agent.enabled).addClass("tsm_bottomLeft");

      bgElement.append(name).append(enabled);
      $("div.tsm_wrapper").append(bgElement);
    }); 
  });

  var h = $.get("http://lon1vci01.int.openbet.com/agents.html?tab=disconnectedAgents", null, function(data){
    var disconnectedAgents = [];
    data = $(data);

    var table = $("div#agentsTable tr.agentRow--1", data).each(function(index, row) {
      var name = $(".buildAgentName a", row).text();
      var enabled = $(".agentStatus span.agent", row).text();
      var disconnectTime = $(".lastActivity span.date", row).text();
      disconnectedAgents.push({name:name, enabled:enabled, disconnectTime:disconnectTime});
    });

    $.each(disconnectedAgents, function(index, agent) {
      var bgElement = $("<div>").addClass("tsm_orange");
      var name = $("<div>").html(agent.name).addClass("tsm_topLeft");
      var enabled = $("<div>").html(agent.enabled).addClass("tsm_bottomLeft");
      var disconnectTime = $("<div>").html(agent.disconnectTime).addClass("tsm_topRight");

      bgElement.append(name).append(enabled).append(disconnectTime);
      $("div.tsm_wrapper").append(bgElement);
    });
  
  });

});