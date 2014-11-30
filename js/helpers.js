var parseDateString = function (dateString) {
  var date = dateString.substring(0,8);
  var year = date.substring(0,4);
  var month = date.substring(4,6);
  var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month-1];

  var day = date.substring(6,8);
  var finishDate = day + " " +  month + " " + year;
  
  var time = dateString.substring(9,14);
  var hours = time.substring(0,2);
  var minutes = time.substring(2,4);
  var finishTime = hours + ":" +  minutes;

  return "Failed on " + finishDate + " at " + finishTime;
}

var createOrUpdateElement = function (id, wrapper, topLeftText, topRightText, bottomLeftText, bottomRightText, color) {
  var existingElement = $("div#" + id);

  if (existingElement.length > 0) {
    var bgElement = existingElement;
    var topLeft = $("div.tsm_topLeft", existingElement);
    var topRight = $("div.tsm_topRight", existingElement);
    var bottomLeft = $("div.tsm_bottomLeft", existingElement);
    var bottomRight = $("div.tsm_bottomRight", existingElement);
  }
  else {
    var bgElement = $("<div>").attr("id", id);
    var topLeft = $("<div>").addClass("tsm_topLeft");
    var topRight = $("<div>").addClass("tsm_topRight");
    var bottomLeft = $("<div>").addClass("tsm_bottomLeft");
    var bottomRight = $("<div>").addClass("tsm_bottomRight");
    bgElement.append(topLeft).append(topRight).append(bottomLeft).append(bottomRight);
    wrapper.append(bgElement);
  }

  topLeft.html(topLeftText);
  topRight.html(topRightText);
  bottomLeft.html(bottomLeftText);
  bottomRight.html(bottomRightText);

  bgElement.removeClass().addClass(color);
}