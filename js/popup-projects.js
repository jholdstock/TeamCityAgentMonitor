var selectedServer;
var editingExistingProjectPreferences = false;

var editButtonClick = function(servers, i) {
	return function() {
		hideAll();
		$("#projectCheckboxes").empty();

		selectedServer = i;
		editingExistingProjectPreferences = true;
		
		var tc = new TeamCityClient(servers[i].url, servers[i].creds);

		tc.getProjects(projectsCallback)
	};
}

var projectsCallback = function(a,b,c) {
	var projects = a.project;

	for (var i = 0; i < projects.length; i++) {
		var p = projects[i];
		var checkbox = $("<input type='checkbox'>").attr("id", "tsm_bk_" + p.id).prop("tsm_pid", p.id);
	 	var label = $("<label>").attr("for", "tsm_bk_" + p.id).html("" + p.name.replace("<", "&lt;").replace(">", "&gt;"));
		var pEl = $("<div>").attr("id", "tsm_p_" + p.id).append([checkbox, label]);
		if (p.parentProjectId && $("#tsm_p_" + p.parentProjectId).length) {
			$("#tsm_p_" + p.parentProjectId).append(pEl);
		} else {
			$("#projectCheckboxes").append(pEl);
		}
	}
	
	loadFromStorage();

	$("#projectList").show();
	$("#saveProjectsBtn").focus();
}

var saveProjects = function() {
	var checked = false;
	$.each($("div#projectCheckboxes input:checked"), function(i, el) {
		checked = true;
	});

	if (checked == false) {
		alert("You must choose at least one project");
		return;
	}
	
	var server;
	if (editingExistingProjectPreferences) {
		server = servers[selectedServer];
	} else {
		server = {
			url:enteredUrl(),
			creds:enteredCreds(),
		};

		servers.push(server);
	}
	
	var selectedProjects = [];
	$.each($("div#projectCheckboxes input:checked"), function(i, el) {
		selectedProjects.push($(el).prop("tsm_pid"));
	});
	server.projects = selectedProjects;
	saveConfig({servers:servers}, function() {});

	showServerList();
}

var loadFromStorage = function() {
	if (editingExistingProjectPreferences) {
		var saved = servers[selectedServer].projects;
		if (saved) {
			$.each(saved, function(i, el) {
				$("#tsm_bk_" + el).prop("checked", "checked");
			});
			return;
		}
	}
	$("div#projectCheckboxes input").prop("checked", "checked");
}