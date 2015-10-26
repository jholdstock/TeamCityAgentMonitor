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
      var mostRecentBuild = response.build[0];
      mostRecentBuild.buildType = buildType;
      ajaxGet(mostRecentBuild.href, buildCallback);  
    }
    else {
      var neverRun = { neverRun: true, buildType: buildType };
      receivedBuilds.push(neverRun);
      checkIfAllBuildsReceived();
    }
  }
};

var buildCallback = function(build) {
  receivedBuilds.push(build);
  checkIfAllBuildsReceived();
};

var checkIfAllBuildsReceived = function() {
  if (receivedBuilds.length >= expectedBuilds) {
      updateBottomPanel(receivedBuilds);
      if (refreshBuilds & !handlingError) setTimeout(downloadAndDisplayBuilds, buildRefreshRate);
    }
}

var updateBottomPanel = function(builds) {
  $("#tsm_build_init").remove();
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
    var build = new Build(builds[i]);
    if (build.shouldBeDrawn()) {
      drawBuild(build);
    } else {
      $("div#"+build.getId()).remove();
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
