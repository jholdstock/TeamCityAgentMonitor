var removeElementIfExists = function(id) {
  $("div#tsm_" + id).remove();
} 

var drawAgent = function(id, name, status, color) {
  createOrUpdateElement(id, $(".tsm_agent_wrapper"), name, status, "AGENT", "", color);
}

var drawBuild = function(id, name, date, status, statusText) {
  createOrUpdateElement(id, $("div.tsm_build_wrapper"), name, date, statusText, "", "tsm_red");
}

var createOrUpdateElement = function(id, wrapper, topLeftText, topRightText, bottomLeftText, bottomRightText, color) {
  id = "tsm_" + id;
  var existingElement = $("div#" + id, wrapper);

  if (existingElement.length > 0) {
    var bgElement = existingElement;
    var topLeft = $("div.tsm_topLeft", existingElement);
    var topRight = $("div.tsm_topRight", existingElement);
    var bottomLeft = $("div.tsm_bottomLeft", existingElement);
    var bottomRight = $("div.tsm_bottomRight", existingElement);
  }
  else {
    var bgElement = $("<div>").attr("id", id);
    var topLeft = $("<div>").addClass("tsm_topLeft").addClass("tsm_border");
    var topRight = $("<div>").addClass("tsm_topRight").addClass("tsm_border");
    var bottomLeft = $("<div>").addClass("tsm_bottomLeft").addClass("tsm_translucent");
    var bottomRight = $("<div>").addClass("tsm_bottomRight").addClass("tsm_border");
    bgElement.append(topLeft).append(topRight).append(bottomLeft).append(bottomRight);
    wrapper.append(bgElement);
  }

  topLeft.html(topLeftText);
  topRight.html(topRightText);
  bottomLeft.html(bottomLeftText);
  bottomRight.html(bottomRightText);

  bgElement.removeClass().addClass(color);
}