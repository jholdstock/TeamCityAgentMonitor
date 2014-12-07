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
      drawBuildStatus(receivedBuilds);
      if (refreshBuilds) setTimeout(downloadAndDisplayBuilds, buildRefreshRate);
    }
  };
};

var drawBuildStatus = function(builds) {
  removeBuildsWhichNoLongerExist(builds);

  for (var i = 0; i < builds.length; i++) {
    var build = builds[i];

    if (build.neverRun === true) {
      drawNeverRunBuild(build.buildType);
    }
    else if (build.status != "SUCCESS") {
      drawFailedBuild(build);
    }
    else {
      $("#tsm_b_" + build.buildType.id).remove();
    }
    
    showSuccessIfAppropriate();
  }
};

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

var showSuccessIfAppropriate = function() {
  if ($("div[id^=tsm_b_").length) {
    $("div#tsm_success").remove();
  }
  else {
    var id = "tsm_success";
    var wrapper = $("div.tsm_build_wrapper");
    var existingElement = getElementIfExists(id, wrapper);

    if (existingElement === undefined) {
      existingElement = $("<div>").attr("id", id).addClass("tsm_green");
      var centre = $("<div>").addClass("tsm_centre").addClass("tsm_border");
      
      existingElement.append(centre);
      wrapper.append(existingElement);
    }

    $("div.tsm_centre", existingElement).html("All builds are passing");
  }
}