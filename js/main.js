var downloadAndDisplayQueue = function() {
  ajaxGet("/httpAuth/app/rest/buildQueue", function(response) {
    var queue = response.build;
    var length = 0; 
    if (queue !== undefined) {
      length = queue.length;
    }
    
    $(".tsm_centre").html(length);
    if (refreshQueue) setTimeout(downloadAndDisplayQueue, queueRefreshRate);
  });
}

var prepareDOM = function() {
  var body = $("body");
  body.empty();
  $("<div>").addClass("tsm_agent_wrapper").appendTo(body);
  $("<div>").addClass("tsm_build_wrapper").appendTo(body);
  var queueElement = $("<div>").attr("id", "tsm_queue").addClass("tsm_black");
  var label = $("<div>").addClass("tsm_top").html("Queue Length");
  var centre = $("<div>").addClass("tsm_centre").html("0");
  queueElement.append(label).append(centre);
  $("div.tsm_agent_wrapper").append(queueElement);
}

var agentRefreshRate = 3000;
var buildRefreshRate = 3000;
var queueRefreshRate = 1500;

var refreshAgents = true;
var refreshBuilds = true;
var refreshQueue = true;
//refreshAgents = false;
//refreshBuilds = false;
//refreshQueue = false;

prepareDOM();

downloadAndDisplayQueue();
setTimeout(downloadAndDisplayAgents, buildRefreshRate/2);
downloadAndDisplayBuilds();