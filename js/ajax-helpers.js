var handlingError = false;
var ajaxError = function() {
  if (handlingError) return;
  handlingError = true;
  $(document).ajaxStop(function () {
    $(this).unbind("ajaxStop");
    var whiteout = $("<div>").addClass("tsm_whiteout");
    var spinnerUrl = chrome.extension.getURL('img/spinner.gif');
    var errorDiv = $("<div>").addClass("tsm_bigAlert").html("TeamCity at " + tcUrl + " is not available.<br /><br />Attempting reconnection<br /><img src='" + spinnerUrl + "'' />");
    $("body").append(errorDiv).append(whiteout);
    attemptReconnect();
  })
}

var testCallback = function(a,b) {
  if (b != "success") {
    setTimeout(attemptReconnect, 2000);
    return;
  } 

  try {
    if ($(a.responseText)[1].text.search("TeamCity") == -1) throw 1;
    if ($(a.responseText)[1].text.search("TeamCity is starting") > -1) throw 1;
  } catch (err) {
    setTimeout(attemptReconnect, 2000);
    return;
  }

  handlingError = false;
  $(".tsm_whiteout").remove();
  $(".tsm_bigAlert").remove();

  downloadAndDisplayAgents();
  downloadAndDisplayBuilds();  
}

var attemptReconnect = function() {
  tc.testConnection(testCallback);
}
