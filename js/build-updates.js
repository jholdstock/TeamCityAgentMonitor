var expectedBuilds;
var receivedBuilds;

var downloadAndDisplayBuilds = function() {
  expectedBuilds = 0;
  receivedBuilds = [];
  ajaxGet("/httpAuth/app/rest/buildTypes", function(response) {
    var buildTypes = response.buildType;
    expectedBuilds = buildTypes.length;
    for (var i = 0; i < buildTypes.length; i++) {
      ajaxGet("/httpAuth/app/rest/builds/?locator=count:1,canceled:false,running:false,buildType:id:" + buildTypes[i].id,
       getBuildDetails(buildTypes[i]));
    }
  });
};

var getBuildDetails = function(buildType) {
  return function(response) {
    if (response.build && response.build[0]) {
      ajaxGet(response.build[0].href, buildCallback(buildType));  
    }
    else {
      // TODO: Build has never run
      // For now just push a flag - need to replace with actual build obj
      receivedBuilds.push(123);
    }
  }
};

var buildCallback = function(buildType) {
  return function(build) {
    build.buildType = buildType;
    receivedBuilds.push(build);
    
    if (receivedBuilds.length >= expectedBuilds) {
      drawBuildStatus(receivedBuilds);
      if (refreshBuilds) setTimeout(downloadAndDisplayBuilds, buildRefreshRate);
    }
  };
};

var drawBuildStatus = function(builds) {
  for (var i = 0; i < builds.length; i++) {
    var build = builds[i];

    // TODO: Handle build which never ran.
    if (build == 123) continue;

    if (build.status != "SUCCESS") {
      drawFailedBuild(build);
    }
    else {
      $("#tsm_" + build.buildType.id).remove();
    }
  }  
};