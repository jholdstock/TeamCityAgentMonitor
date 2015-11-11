function TeamCityClient(tcUrl, tcCreds) {
	this.tcUrl = tcUrl;
	this.tcCreds = tcCreds;

	this.tcHeaders = { 
		Accept:"application/json", 
		Authorization: "Basic " + this.tcCreds
	};

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
		this.ajax("/httpAuth/app/rest/projects").done(callback);
	}

	this.attemptReconnect = function(callback) {
		this.ajax("").complete(callback);
	}

	this.ajaxGet = function(url, callback) {
		this.ajax(url).success(callback).error(ajaxError);
	}

	this.ajax = function(url) {
		return $.ajax({
			url: this.tcUrl + url,
			headers: this.tcHeaders,
		});
	}
}