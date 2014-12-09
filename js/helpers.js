var drawAgent = function(id, name, status, color) {
  var wrapper = $(".tsm_agent_wrapper");
  var existingElement = getElementIfExists(id, wrapper);

  if (existingElement === undefined) {
    existingElement = $("<div>").attr("id", id);
    var topLeft = $("<div>").addClass("tsm_topLeft").addClass("tsm_border");
    var topRight = $("<div>").addClass("tsm_topRight").addClass("tsm_border");
    var bottomLeft = $("<div>").addClass("tsm_bottomLeft").addClass("tsm_translucent").html("AGENT");
    existingElement.append(topLeft).append(topRight).append(bottomLeft);
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
  
  var now = new Date();
  var then = new TeamCityDate(build.finishDate).getDate();
  var interval = new TimeInterval(now, then);
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
    var topLeft = $("<div>").addClass("tsm_topLeft").addClass("tsm_border");
    var topRight = $("<div>").addClass("tsm_topRight").addClass("tsm_border");
    var bottomLeft = $("<div>").addClass("tsm_bottomLeft").addClass("tsm_translucent").addClass("tsm_border");
    existingElement.append(topLeft).append(topRight).append(bottomLeft);
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

var ajaxGet = function(url, callback) {
  $.ajax({
    url: tcUrl + url,
    headers: { Accept:"application/json" },
    success: callback
  });
}