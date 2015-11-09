var getAgents = function(callback) {
  ajaxGet("/httpAuth/app/rest/agents", callback);
}

var getFromUrl = function(url, callback) {
  ajaxGet(url, callback);
}

var getBuildTypesForProject = function(projectId, callback) {
  ajaxGet("/httpAuth/app/rest/buildTypes?locator=project:" + projectId, callback);
}

var getLatestBuild = function(buildTypeId, callback) {
  ajaxGet("/httpAuth/app/rest/builds/?locator=count:1,canceled:false,running:false,buildType:id:" + buildTypeId, callback);
}

var getProjects = function(url, creds, callback) {
  $.ajax({
    url: url + "/httpAuth/app/rest/projects",
    headers: { Accept:"application/json", Authorization: "Basic " + creds },
  }).done(callback);
}

var ajaxGet = function(url, callback) {
  $.ajax({
    url: tcUrl + url,
    headers: { Accept:"application/json", Authorization: "Basic " + tcCreds },
    success: callback,
    error: ajaxError
  });
}