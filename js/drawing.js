var getElementIfExists = function(selector) {
  var existingElement = $("div#"+selector);
  if (existingElement.length > 0) {
    return existingElement;
  } else {
    return undefined;
  }
}

var drawAgent = function(id, name, status, color) {
  var existingElement = getElementIfExists(id);

  if (existingElement === undefined) {
    existingElement = $("<div>").attr("id", id);
    
    existingElement.append([
      $("<div>").addClass("tsm_topLeft tsm_border"),
      $("<div>").addClass("tsm_topRight tsm_border"),
      $("<div>").addClass("tsm_bottomLeft tsm_translucent").html("AGENT")
    ]);

    $("#tsm_agent_wrapper").append(existingElement);
  }

  $("div.tsm_topLeft", existingElement).html(name);
  $("div.tsm_topRight", existingElement).html(status);
  existingElement.removeClass().addClass(color);
}

var drawBuild = function(build) {
  var existingElement = getElementIfExists(build.getId());

  if (existingElement === undefined) {
    existingElement = $("<div>").attr("id", build.getId());
    existingElement.append([
      $("<div>").addClass("tsm_topLeft tsm_border"),
      $("<div>").addClass("tsm_topRight tsm_border"),
      $("<div>").addClass("tsm_bottomLeft tsm_border tsm_translucent")
    ]);
    $("div#tsm_build_wrapper").append(existingElement);
  }

  $("div.tsm_topLeft", existingElement).html(build.getName());
  $("div.tsm_topRight", existingElement).html(build.getDateAndTimeSince());
  $("div.tsm_bottomLeft", existingElement).html(build.getStatus());
  existingElement.removeClass().addClass("tsm_" + build.getColor());
}

var drawSuccessMessage = function() {
  var id = "tsm_success";
  var existingElement = getElementIfExists(id);

  if (existingElement === undefined) {
    existingElement = $("<div>").attr("id", id).addClass("tsm_green");
    
    existingElement.append($("<div>").attr("id", "tsm_success_msg").addClass("tsm_border").html(greenMessage));
    
    $("div#tsm_build_wrapper").append(existingElement);
  }
}
