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
	$("<table>").attr("id", "serverTable").css("padding", "0.5rem 0 1rem").appendTo($("#serverLinks"));
	$.each(servers, function(index, server){
		var name = $("<td>")
			.text(server.url)
			.append("&nbsp;&nbsp;&nbsp;")
			.css("padding", "1rem 0");

		var button = $("<td>").append(
			$("<button>")
				.text("View")
				.click(serverButtonClick(server.url, server.creds))
			);

		$("<tr>").append([name, button]).appendTo($("#serverTable"));
	});
	
	$("#serverList").show();
}

var serverButtonClick = function(url, creds) {
	return function() {
		chrome.extension.getBackgroundPage().openTab(url, creds);
    	exit();
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