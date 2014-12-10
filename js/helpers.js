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

var ajaxError = function() {
  alert("An error occurred contacting TeamCity.");
  location.reload();
}

var ajaxGet = function(url, callback) {
  $.ajax({
    url: tcUrl + url,
    headers: { Accept:"application/json" },
    success: callback,
    error: ajaxError
  });
}