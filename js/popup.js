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
	$('#showSuccessful').prop("checked", items.showSuccessful);
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
			.text(server.url);

		var viewBtn = $("<td>").append(
			$("<button>")
				.text("View")
				.click(serverButtonClick(server))
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

		$("<tr>").append([name, viewBtn, delBtn, editBtn]).appendTo(serverTable);
	});
	
	$("#serverLinks").append(serverTable);

	$("#serverList").show();
}

var serverButtonClick = function(server) {
	return function() {
		var tc = new TeamCityClient(server.url, server.creds);
		tc.getProjects(function() {
			chrome.extension.getBackgroundPage().openTab(server);
			exit();
		});
	};
}

var deleteButtonClick = function(servers, i) {
	return function() {
		if (confirm("Delete " + servers[i].url + "?")) {
			servers.splice(i, 1);
			saveConfig({servers:servers}, function() {});
			showServerList();
		}
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
	$("#chooseProjectsBtn").hide();
	$("#credsDiv").hide();
	updateTestStatus("");
	updateCredsStatus("");
}

var exit = function() {
	window.close();
}

$(".exit").click(exit);
$(".showServersBtn").click(showServerList);
$(".addServerBtn").click(showAddServer);
$("#chooseProjectsBtn").click(chooseProjects);
$("#saveProjectsBtn").click(saveProjects);
$("#checkCredsBtn").click(checkCreds);
$("#settingsBtn").click(showSettings);
$("#test").click(checkEnteredUrl);
$("#allBtn").click(allBtnClicked);
$("#noneBtn").click(noneBtnClicked);
$("#url").keydown(urlInputChanged).change(urlInputChanged);
$("#username").keydown(usernameInputChanged).change(usernameInputChanged);
$("#password").keydown(passwordInputChanged).change(passwordInputChanged);