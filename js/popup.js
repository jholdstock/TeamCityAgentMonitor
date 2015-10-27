var hideAll = function() {
	$("#noServers, #serverList, #addServer, #settings").hide();	
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

$(".addServerBtn").click(showAddServer);
$(".exit").click(exit);
$("#saveServerBtn").click(saveNewServer);
$("#checkCredsBtn").click(checkCreds);
$(".showServersBtn").click(showServerList);
$(".settingsBtn").click(showSettings);
$("#test").click(testConnection);
$("#url").keydown(urlInputChanged).change(urlInputChanged);
$("#username").keydown(credsInputChanged).change(credsInputChanged);
$("#password").keydown(credsInputChanged).change(credsInputChanged);