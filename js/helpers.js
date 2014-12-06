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

var drawFailedBuild = function(build) {
  var id = "tsm_" + build.buildType.id;
  var wrapper = $("div.tsm_build_wrapper");
  var existingElement = getElementIfExists(id, wrapper);

  if (existingElement === undefined) {
    existingElement = $("<div>").attr("id", id);
    var topLeft = $("<div>").addClass("tsm_topLeft").addClass("tsm_border");
    var topRight = $("<div>").addClass("tsm_topRight").addClass("tsm_border");
    var bottomLeft = $("<div>").addClass("tsm_bottomLeft").addClass("tsm_translucent");
    existingElement.append(topLeft).append(topRight).append(bottomLeft);
    wrapper.append(existingElement);
  }

  $("div.tsm_topLeft", existingElement).html(build.buildType.projectName + " :: " + build.buildType.name);
  $("div.tsm_topRight", existingElement).html(parseDateString(build.finishDate));
  $("div.tsm_bottomLeft", existingElement).html(build.statusText);
  existingElement.removeClass().addClass("tsm_red");
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