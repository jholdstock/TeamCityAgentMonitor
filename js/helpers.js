var parseDateString = function (dateString) {
  var date = dateString.substring(0,8);
  var year = date.substring(0,4);
  var month = date.substring(4,6);
  var sMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month-1];

  var day = date.substring(6,8);
  var finishDate = day + " " + sMonth + " " + year;
  
  var time = dateString.substring(9,14);
  var hours = time.substring(0,2);
  var minutes = time.substring(2,4);
  var finishTime = hours + ":" +  minutes;

  var then = new Date(year, month-1, day, hours, minutes, 0, 0);
  
  return "Failed on " + finishDate + " at " + finishTime + "<br>" + getElapsedTime(then);
}

var removeElementIfExists = function(id) {
  $("div#tsm_" + id).remove();
} 

var drawAgent = function(id, name, status, color) {
  createOrUpdateElement(id, $(".tsm_agent_wrapper"), name, status, "AGENT", "", color);
}

var drawBuild = function(id, name, date, status, statusText) {
  createOrUpdateElement(id, $("div.tsm_build_wrapper"), name, date, status, statusText, "tsm_red");
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

var getElapsedTime = function(then) {
  var now = new Date();

  var minutes = Math.floor((now - then)/1000/60);

  if (minutes == 0) {
    return "Less than a minute ago";
  } 

  if (minutes < 60) {
    return constructSubString(minutes, "minute") + " ago";
  } 

  var hours = Math.floor(minutes / 60);
  minutes = minutes % 60;

  if (hours < 24) {
    return constructString(hours, "hour", minutes, "minute");
  }

  var days = Math.floor(hours / 24);
  hours = hours % 24;

  return constructString(days, "day", hours, "hour");
};

var constructString = function(val1, unit1, val2, unit2) {
  return constructSubString(val1, unit1) + " " + constructSubString(val2, unit2) + " ago";
};

var constructSubString = function(val, unit) {
  if (val > 1) { unit += "s" };
  return val + " " + unit;
}