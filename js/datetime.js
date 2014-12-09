var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var getFailureDateTime = function(now, then) {
  var sMonth = monthNames[then.getMonth()];
  var finishDate = then.getDate() + " " + sMonth + " " + then.getFullYear();

  var hours = ("0" + then.getHours()).slice(-2);
  var minutes = ("0" + then.getMinutes()).slice(-2);
  var finishTime = hours + ":" + minutes;
  
  return "Failed on " + finishDate + " at " + finishTime;
}

var getElapsedTime = function(now, then) {
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