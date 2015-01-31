var downloadAndDisplayQueue = function() {
  ajaxGet("/httpAuth/app/rest/buildQueue", function(response) {
    var queue = response.build;
    var length = 0; 
    if (queue !== undefined) {
      length = queue.length;
    }
    
    $(".tsm_queue_count").html(length);
    if (refreshQueue & !handlingError) setTimeout(downloadAndDisplayQueue, queueRefreshRate);
  });
}

var prepareDOM = function() {
  $("body").empty().append([
    $("<div>").addClass("tsm_agent_wrapper"),
    $("<div>").addClass("tsm_build_wrapper")
  ]);
  var queueElement = $("<div>").addClass("tsm_black");
  queueElement.append([
    $("<div>").addClass("tsm_queue_label").html("Queue Length"),
    $("<div>").addClass("tsm_queue_count").html("0")
  ]);
  $("div.tsm_agent_wrapper").append(queueElement);
}

var agentRefreshRate = 30000;
var buildRefreshRate = 30000;
var queueRefreshRate = 15000;

var refreshAgents = true;
var refreshBuilds = true;
var refreshQueue = true;
//refreshAgents = false;
//refreshBuilds = false;
//refreshQueue = false;

prepareDOM();

downloadAndDisplayQueue();
downloadAndDisplayAgents();
downloadAndDisplayBuilds();