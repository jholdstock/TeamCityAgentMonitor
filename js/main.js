chrome.runtime.sendMessage({}, function(response) {
  var body = $("body");
  body.empty();
  
  var h = $.get("http://lon1vci01.int.openbet.com/agents.html", null, function(data){
    var agents = [];
    data = $(data);

    var table = $("div#agentsTable tr.agentRow--1", data).each(function(index, row) {
      var name = $(".buildAgentName a", row).text();
      var enabled = $(".agentStatus span.agent", row).text();

      agents.push({name:name, enabled:enabled});
    });

    $.each(agents, function(index, agent) {
      var bgElement = $("<div>");
      var name = $("<div>").html(agent.name);
      var enabled = $("<div>").html(agent.enabled);

      bgElement.append(name).append(enabled);
      $("body").append(bgElement);
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
      var bgElement = $("<div>");
      var name = $("<div>").html(agent.name);
      var enabled = $("<div>").html(agent.enabled);
      var disconnectTime = $("<div>").html(agent.disconnectTime);

      bgElement.append(name).append(enabled).append(disconnectTime);
      $("body").append(bgElement);
    });
  
  });

});