var expectedBuilds;
var receivedBuilds;
var receivedProjects;
var buildTypes;

var downloadAndDisplayBuilds = function() {
  expectedBuilds = 0;
  receivedBuilds = [];
  receivedProjects = 0
  buildTypes = []
  for (index in server.projects) {
    ajaxGet("/httpAuth/app/rest/buildTypes?locator=project:" + server.projects[index], function(response) {
      buildTypes = buildTypes.concat(response.buildType);
      receivedProjects++;
      if (receivedProjects >= server.projects.length) {
        expectedBuilds = buildTypes.length;
        
        updateSummary(expectedBuilds, server.projects.length);

        for (var i = 0; i < buildTypes.length; i++) {
          ajaxGet("/httpAuth/app/rest/builds/?locator=count:1,canceled:false,running:false,buildType:id:" + buildTypes[i].id, getBuildDetails(buildTypes[i]));
        }
      }
    });

  }
};

var updateSummary = function(builds, projects) {
  var summary = "Monitoring " + builds;
  if (builds > 1) summary += " builds"; else summary += " build";
  summary += " in " + projects;
  if (projects > 1) summary += " projects"; else summary += " project";
  $("#tsm_summary").html(summary);
}

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
