var getAgents = function(callback) {
  ajaxGet("/httpAuth/app/rest/agents", callback);
}

var getProject = function(projectId, callback) {
  ajaxGet("/httpAuth/app/rest/buildTypes?locator=project:" + projectId, callback);
}

var getLatestBuild = function(buildTypeId, callback) {
  ajaxGet("/httpAuth/app/rest/builds/?locator=count:1,canceled:false,running:false,buildType:id:" + buildTypeId, callback);
}