function TeamCityDate(dateString) {
  this.date = null;

  this.construct = function(dateString) {
    var year = dateString.substring(0,4);
    var month = dateString.substring(4,6);
    var day = dateString.substring(6,8);
    var hours = dateString.substring(9,11);
    var minutes = dateString.substring(11,13);
    var seconds = dateString.substring(13,15);
    this.date = new Date(year, month-1, day, hours, minutes, seconds, 0);  
  };

  this.getDate = function() {
    return this.date;
  };

  this.construct(dateString);
};