function DateTimeFormatter(date) {
  this.date = null;

  this.construct = function(date) {
    this.date = date;
  };

  this.getDate = function() {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var day = this.date.getDate();
    var monthIndex = this.date.getMonth();
    var year = this.date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  this.getTime = function() {
    var hours = ("0" + this.date.getHours()).slice(-2);
    var minutes = ("0" + this.date.getMinutes()).slice(-2);
    return hours + ":" + minutes;
  }

  this.getTimeWithSeconds = function() {
    var seconds = ("0" + this.date.getSeconds()).slice(-2);
    return this.getTime() + ":" + seconds;
  }

  this.construct(date);
};