var drawAgent = function(id, name, status, color) {
  var wrapper = $(".tsm_agent_wrapper");
  var existingElement = getElementIfExists(id, wrapper);

  if (existingElement === undefined) {
    existingElement = $("<div>").attr("id", id);
    
    existingElement.append([
      $("<div>").addClass("tsm_topLeft tsm_border"),
      $("<div>").addClass("tsm_topRight tsm_border"),
      $("<div>").addClass("tsm_bottomLeft tsm_translucent").html("AGENT")
    ]);

    wrapper.append(existingElement);
  }

  $("div.tsm_topLeft", existingElement).html(name);
  $("div.tsm_topRight", existingElement).html(status);
  existingElement.removeClass().addClass(color);
}

var drawNeverRunBuild = function(buildType) {
  var name = buildType.projectName + " :: " + buildType.name;
  drawBuild(buildType.id, name, "", "Build has never run", "tsm_orange")
}

var drawFailedBuild = function(build) {
  var buildType = build.buildType;
  var name = buildType.projectName + " :: " + buildType.name;
  
  var failureTime = new TeamCityDate(build.finishDate).getDate();
  var interval = new TimeInterval(new Date(), failureTime);
  var msg1 = interval.getFailureDateTime();
  var msg2 = interval.getElapsedTime() + " ago";
  var dateString = msg1 + "<br>" + msg2;

  drawBuild(buildType.id, name, dateString, build.statusText, "tsm_red");
}

var drawBuild = function(id, name, topRightText, bottomLeftText, color) {
  var id = "tsm_b_" + id;
  var wrapper = $("div.tsm_build_wrapper");
  var existingElement = getElementIfExists(id, wrapper);

  if (existingElement === undefined) {
    existingElement = $("<div>").attr("id", id);
    existingElement.append([
      $("<div>").addClass("tsm_topLeft tsm_border"),
      $("<div>").addClass("tsm_topRight tsm_border"),
      $("<div>").addClass("tsm_bottomLeft tsm_border tsm_translucent")
    ]);
    wrapper.append(existingElement);
  }

  $("div.tsm_topLeft", existingElement).html(name);
  $("div.tsm_topRight", existingElement).html(topRightText);
  $("div.tsm_bottomLeft", existingElement).html(bottomLeftText);
  existingElement.removeClass().addClass(color);
}

var getElementIfExists = function(selector, wrapper) {
  var existingElement = $("div#"+selector, wrapper);
  if (existingElement.length > 0) {
    return existingElement;
  } else {
    return undefined;
  }
}

var handlingError = false;
var ajaxError = function() {
  if (handlingError) return;
  handlingError = true;
  $(document).ajaxStop(function () {
    $(this).unbind("ajaxStop");
    var whiteout = $("<div>").addClass("tsm_whiteout");
    var spinnerUrl = chrome.extension.getURL('img/spinner.gif');
    var errorDiv = $("<div>").addClass("tsm_bigAlert").html("TeamCity at " + tcUrl + " is not available.<br /><br />Attempting reconnection<br /><img style='margin-top:1.2rem;' height='150px' width='150px' src='" + spinnerUrl + "'' />");
    $("body").append(errorDiv).append(whiteout);
    attemptReconnect();
  })
}

var testCallback = function(a,b) {
  if (b != "success") {
    setTimeout(attemptReconnect, 2000);
    return;
  } 

  try {
    if ($(a.responseText)[1].text.search("TeamCity") == -1) throw 1;
    if ($(a.responseText)[1].text.search("TeamCity is starting") > -1) throw 1;
  } catch (err) {
    setTimeout(attemptReconnect, 2000);
    return;
  }

  handlingError = false;
  $(".tsm_whiteout").remove();
  $(".tsm_bigAlert").remove();

  downloadAndDisplayQueue();
  downloadAndDisplayAgents();
  downloadAndDisplayBuilds();  
}

var attemptReconnect = function() {
  $.ajax({
    url: tcUrl,
    headers: { Accept:"application/json" },
    complete: testCallback
  });
}

var ajaxGet = function(url, callback) {
  $.ajax({
    url: tcUrl + url,
    headers: { Accept:"application/json" },
    success: callback,
    error: ajaxError
  });
}