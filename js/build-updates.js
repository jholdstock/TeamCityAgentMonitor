var expectedBuilds;
var receivedBuilds;

var downloadAndDisplayBuilds = function() {
  expectedBuilds = 0;
  receivedBuilds = [];
  ajaxGet("/httpAuth/app/rest/buildTypes", function(response) {
    var buildTypes = response.buildType;
    expectedBuilds = buildTypes.length;
    for (var i = 0; i < buildTypes.length; i++) {
      ajaxGet("/httpAuth/app/rest/builds/?locator=count:1,canceled:false,running:false,buildType:id:" + buildTypes[i].id, getBuildDetails(buildTypes[i]));
    }
  });
};

var getBuildDetails = function(buildType) {
  return function(response) {
    if (response.build && response.build[0]) {
      ajaxGet(response.build[0].href, buildCallback(buildType));  
    }
    else {
      var neverRun = { neverRun: true, buildType: buildType };
      receivedBuilds.push(neverRun);
    }
  }
};

var buildCallback = function(buildType) {
  return function(build) {
    build.buildType = buildType;
    receivedBuilds.push(build);
    
    if (receivedBuilds.length >= expectedBuilds) {
      updateBottomPanel(receivedBuilds);
      if (refreshBuilds & !handlingError) setTimeout(downloadAndDisplayBuilds, buildRefreshRate);
    }
  };
};

var updateBottomPanel = function(builds) {
  removeBuildsWhichNoLongerExist(builds);
  updateFailedAndNeverRunBuilds(builds);
  if ($("div[id^=tsm_b_").length) {
    $("div#tsm_success").remove();
  }
  else {
    drawSuccessMessage();
  }
};

var updateFailedAndNeverRunBuilds = function(builds) {
  for (var i = 0; i < builds.length; i++) {
    var build = builds[i];

    var myBuild = {
      name: build.buildType.projectName + " :: " + build.buildType.name,
      id: "tsm_b_" + build.buildType.id,
    };

    if (build.neverRun === true) {
      myBuild.date = "";
      myBuild.statusText = "Build has never run";
      myBuild.color = "orange";

      drawBuild(myBuild);
    }
    else if (build.status != "SUCCESS") {
      var failureTime = new TeamCityDate(build.finishDate).getDate();
      var interval = new TimeInterval(new Date(), failureTime);
      var msg1 = interval.getFailureDateTime();
      var msg2 = interval.getElapsedTime() + " ago";

      myBuild.date = msg1 + "<br />" + msg2;
      myBuild.statusText = build.statusText;
      myBuild.color = "red";

      drawBuild(myBuild);
    }
    else {
      $("div#"+myBuild.id).remove();
    }
  }
}

var removeBuildsWhichNoLongerExist = function(builds) {
  $.each($("div[id^=tsm_b_"), function(index, div) {
    div = $(div);
    
    var stillExists = false;
    var btId = div.attr("id").replace("tsm_b_", "");
    for (var i = 0; i < builds.length; i++) {
      if (builds[i].buildType.id == btId) {
        stillExists = true;
        break;
      }
    }
    if (stillExists == false) { 
      div.remove();
    }
  });
}
