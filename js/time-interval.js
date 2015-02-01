function TimeInterval(now, then) {
  this.now = now;
  this.then = then;
  this.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  this.getFailureDateTime = function() {
    var sMonth = this.monthNames[then.getMonth()];
    var finishDate = this.then.getDate() + " " + sMonth + " " + this.then.getFullYear();

    var hours = ("0" + this.then.getHours()).slice(-2);
    var minutes = ("0" + this.then.getMinutes()).slice(-2);
    var finishTime = hours + ":" + minutes;

    return "Failed on " + finishDate + " at " + finishTime;
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