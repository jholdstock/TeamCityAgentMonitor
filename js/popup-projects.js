var editButtonClick = function(servers, i) {
	return function() {
		hideAll();
		$("#projectCheckboxes").empty();

		$.ajax({
			url: servers[i].url + "/httpAuth/app/rest/projects",
			headers: { Accept:"application/json", Authorization: "Basic " + servers[i].creds },
		}).done(projectsCallback);
	};
}

var projectsCallback = function(a,b,c) {
	var projects = a.project;

	for (var i = 0; i < projects.length; i++) {
		var p = projects[i];
		var checkbox = $("<input type='checkbox'>").attr("id", "tsm_bk_" + i);
	 	var label = $("<label>").attr("for", "tsm_bk_" + i).html("" + p.name.replace("<", "&lt;").replace(">", "&gt;"));
		var pEl = $("<div>").css("background", "rgba(0,120,0,0.1)").attr("id", "tsm_p_" + p.id).append([checkbox, label]);
		if (p.parentProjectId && $("#tsm_p_" + p.parentProjectId).length) {
			pEl.css("padding-left", "3rem");
			$("#tsm_p_" + p.parentProjectId).append(pEl);
		} else {
			$("#projectCheckboxes").append(pEl);
		}
	}
	$("#projectList").css("width", "450px").show();

}
