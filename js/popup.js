var hideAll = function() {
	$("#noServers, #serverList, #addServer, #settings, #projectList").hide();	
}
hideAll();

loadConfig(function(items) {
	servers = items.servers;
  $('#refreshRate').val(items.refreshRate);
  $('#successMessage').val(items.successMessage);
  $('#hideCursor').prop("checked", items.hideCursor);
  $('#showAgents').prop("checked", items.showAgents);
  $('#showNeverRun').prop("checked", items.showNeverRun);
  $('#showMuted').prop("checked", items.showMuted);
	showServerList();
});

var showSettings = function() {
	hideAll();
	$("#settings").show();
}

var allBtnClicked = function() {
	$("#projectList input").prop("checked", "checked")
}
var noneBtnClicked = function() {
	$("#projectList input").prop("checked", "")
}	

var showServerList = function() {
	hideAll();
	if (servers.length == 0) {
		$("#noServers").show();
		return;
	} 

	$("#serverLinks").empty();
	var serverTable = $("<table>").attr("id", "serverTable");
	$.each(servers, function(index, server){
		var name = $("<td>")
			.addClass("serverName")
			.text(server.url)
			.append("&nbsp;&nbsp;&nbsp;");

		var viewBtn = $("<td>").append(
			$("<button>")
				.text("View")
				.click(serverButtonClick(server.url, server.creds))
			);

		var delBtn = $("<td>").append(
			$("<button>")
				.text("Delete")
				.click(deleteButtonClick(servers, index))
			);

		var editBtn = $("<td>").append(
			$("<button>")
				.text("Edit")
				.click(editButtonClick(servers, index))
			);

		//$("<tr>").append([name, viewBtn, delBtn, editBtn]).appendTo(serverTable);
		$("<tr>").append([name, viewBtn, delBtn]).appendTo(serverTable);
	});
	
	$("#serverLinks").append(serverTable);

	$("#serverList").show();
}

var serverButtonClick = function(url, creds) {
	return function() {
		chrome.extension.getBackgroundPage().openTab(url, creds);
    	exit();
	};
}

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
	var projects = []
	for (var i = 0; i < a.project.length; i++) {
		var checkbox = $("<input type='checkbox'>");
		var label = $("<label>").html("" + a.project[i].name.replace("<", "&lt;").replace(">", "&gt;"));
		var br = $("<br>");
		$("#projectCheckboxes").append([checkbox, label, br]);
	}
	$("#projectList").show();
}

var deleteButtonClick = function(servers, i) {
	return function() {
		servers = servers.splice(i, 1);
		saveConfig({servers:servers}, function() {});
		showServerList();
	};
}

var showAddServer = function() {
	hideAll();

	hideSaveButtonAndTestStatusAndCredentials();
	$("#addServer").show();

	$("#username").val("");
	$("#password").val("");
	
	$("#url").val("http://");
	$("#url").focus();
}

var hideSaveButtonAndTestStatusAndCredentials = function() {
	$("#saveDiv").hide();
	$("#credsDiv").hide();
	updateTestStatus("");
	updateCredsStatus("");
}

var exit = function() {
	window.close();
}

$(".exit").click(exit);
$(".showServersBtn").click(showServerList);
$("#addServerBtn").click(showAddServer);
$("#saveServerBtn").click(saveNewServer);
$("#checkCredsBtn").click(checkCreds);
$("#settingsBtn").click(showSettings);
$("#test").click(testConnection);
$("#allBtn").click(allBtnClicked);
$("#noneBtn").click(noneBtnClicked);
$("#url").keydown(urlInputChanged).change(urlInputChanged);
$("#username").keydown(credsInputChanged).change(credsInputChanged);
$("#password").keydown(credsInputChanged).change(credsInputChanged);