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