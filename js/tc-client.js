function TeamCityClient(tcUrl, tcCreds) {
  this.tcUrl = tcUrl;
  this.tcCreds = tcCreds;

  this.getAgents = function(callback) {
    this.ajaxGet("/httpAuth/app/rest/agents", callback);
  }  

  this.getFromUrl = function(url, callback) {
    this.ajaxGet(url, callback);
  }

  this.getBuildTypesForProject = function(projectId, callback) {
    this.ajaxGet("/httpAuth/app/rest/buildTypes?locator=project:" + projectId, callback);
  }

  this.getLatestBuild = function(buildTypeId, callback) {
    this.ajaxGet("/httpAuth/app/rest/builds/?locator=count:1,canceled:false,running:false,buildType:id:" + buildTypeId, callback);
  }

  this.getProjects = function(callback) {
    $.ajax({
      url: this.tcUrl + "/httpAuth/app/rest/projects",
      headers: { Accept:"application/json", Authorization: "Basic " + this.tcCreds },
    }).done(callback);
  }

  this.ajaxGet = function(url, callback) {
    $.ajax({
      url: this.tcUrl + url,
      headers: { Accept:"application/json", Authorization: "Basic " + this.tcCreds },
      success: callback,
      error: ajaxError
    });
  }
}