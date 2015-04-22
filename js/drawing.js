var getElementIfExists = function(selector) {
  var existingElement = $("div#"+selector);
  if (existingElement.length > 0) {
    return existingElement;
  } else {
    return undefined;
  }
}

var sortElementsInWrapper = function(wrapper) {
  var $wrapper = $(wrapper);
  var $elements = $wrapper.children('div');

  if ($elements.length <= 1){
    return;
  }

  $elements.sort(function(a,b){
    var an = a.getAttribute('data-name');
    var bn = b.getAttribute('data-name');

    if (an == null || bn == null) {
      return 0;
    }

    return an.toUpperCase().localeCompare(bn.toUpperCase());
  });

  $elements.detach().appendTo($wrapper);  
}

var drawAgent = function(id, name, status, color) {
  var existingElement = getElementIfExists(id);

  if (existingElement === undefined) {
    existingElement = $("<div>").attr("id", id);
    existingElement.attr("data-name", name);
    existingElement.append([
      $("<div>").addClass("tsm_topLeft tsm_border"),
      $("<div>").addClass("tsm_topRight tsm_border"),
      $("<div>").addClass("tsm_bottomLeft tsm_translucent").html("AGENT")
    ]);

    $("div.tsm_agent_wrapper").append(existingElement);
  }

  $("div.tsm_topLeft", existingElement).html(name);
  $("div.tsm_topRight", existingElement).html(status);
  existingElement.removeClass().addClass(color);

  sortElementsInWrapper("div.tsm_agent_wrapper");
}

var drawBuild = function(myBuild) {
  var existingElement = getElementIfExists(myBuild.id);

  if (existingElement === undefined) {
    existingElement = $("<div>").attr("id", myBuild.id);
    existingElement.attr("data-name", myBuild.name);
    existingElement.append([
      $("<div>").addClass("tsm_topLeft tsm_border"),
      $("<div>").addClass("tsm_topRight tsm_border"),
      $("<div>").addClass("tsm_bottomLeft tsm_border tsm_translucent")
    ]);
    $("div.tsm_build_wrapper").append(existingElement);
  }

  $("div.tsm_topLeft", existingElement).html(myBuild.name);
  $("div.tsm_topRight", existingElement).html(myBuild.date);
  $("div.tsm_bottomLeft", existingElement).html(myBuild.statusText);
  existingElement.removeClass().addClass("tsm_" + myBuild.color);
  sortElementsInWrapper("div.tsm_build_wrapper");
}

var drawSuccessMessage = function() {
  var id = "tsm_success";
  var existingElement = getElementIfExists(id);

  if (existingElement === undefined) {
    existingElement = $("<div>").attr("id", id).addClass("tsm_green");
    
    existingElement.append([
      $("<div>").addClass("tsm_success_msg tsm_border"),
      $("<div>").addClass("tsm_success_time tsm_border")
    ]);
    
    $("div.tsm_build_wrapper").append(existingElement);
  }

  $("div.tsm_success_msg", existingElement).html(greenMessage);
  ajaxGet("/httpAuth/app/rest/builds/?locator=count:1,canceled:false,running:false,status:failure", function(response) {
    ajaxGet(response.build[0].href, function(response2) {
      var then = new TeamCityDate(response2.finishDate).getDate();
      var interval = new TimeInterval(new Date(), then);
      $("div.tsm_success_time").html("Last failure was " + interval.getElapsedTime().toLowerCase() + " ago");
    });
  });
}