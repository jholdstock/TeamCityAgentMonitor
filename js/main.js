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

var agentRefreshRate = 5000;
var buildRefreshRate = 300000;
var queueRefreshRate = 1000;

var refreshAgents = true;
var refreshBuilds = true;
var refreshQueue = true;
//refreshAgents = false;
//refreshBuilds = false;
//refreshQueue = false;

prepareDOM();

//downloadAndDisplayQueue();
downloadAndDisplayAgents();
//downloadAndDisplayBuilds();


// These are the config options ready to use 
// alert(refreshRate);
// alert(successMessage);
// alert(hideCursor);