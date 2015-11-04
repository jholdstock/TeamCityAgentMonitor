function TimeInterval(now, then) {
  this.now = now;
  this.then = then;

  this.getFailureDateTime = function() {
    var f = new DateTimeFormatter(this.then);
    
    return "Failed on " + f.getDate() + " at " + f.getTime();
  }

  this.getElapsedTime = function() {
    var minutes = Math.floor((this.now - this.then)/1000/60);

    if (minutes == 0) {
      return "Less than a minute";
    } 

    if (minutes < 60) {
      return this.constructSubString(minutes, "minute");
    } 

    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    if (hours < 24) {
      return this.constructString(hours, "hour", minutes, "minute");
    }

    var days = Math.floor(hours / 24);
    hours = hours % 24;

    return this.constructString(days, "day", hours, "hour");
  };

  this.constructString = function(val1, unit1, val2, unit2) {
    var s1 = this.constructSubString(val1, unit1);
    var s2 = this.constructSubString(val2, unit2);
    if (s2 == "") {
      return s1;
    }
    else {
      return s1 + " " + s2;
    }
  };

  this.constructSubString = function(val, unit) {
    if (val == 0) return "";
    if (val > 1) { unit += "s" };
    return val + " " + unit;
  }
}