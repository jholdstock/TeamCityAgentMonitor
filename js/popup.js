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
	showServerList();
});

$('#saveSettingsBtn').on('click', function() {
  saveConfig({
    refreshRate   : $('#refreshRate').val(),
    successMessage: $('#successMessage').val(),
    hideCursor    : $('#hideCursor').prop("checked"),
    showAgents    : $('#showAgents').prop("checked"),
  }, function() {
    var status = $('#saveSettingsStatus');
    status.text("    Saved.");
    var button = $("#saveSettingsBtn");
    button.prop("disabled", true);
    setTimeout(function() {
      status.text('');
      button.prop("disabled", false);
    }, 1000);
  });
});

$('#refreshRate').on("keydown", function() {
  return ( event.ctrlKey || event.altKey 
                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                    || (95<event.keyCode && event.keyCode<106)
                    || (event.keyCode==8) || (event.keyCode==9) 
                    || (event.keyCode>34 && event.keyCode<40) 
                    || (event.keyCode==46) )
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

var checkCreds = function() {
	if (!$("#username").val()) {
		updateCredsStatus("Please enter a username");	
		return;
	}
	if (!$("#password").val()) {
		updateCredsStatus("Please enter a password");	
		return;
	}

	$.ajax({
		url: enteredUrl()+"/httpAuth/app/rest/buildTypes",
		headers: { Accept:"application/json", Authorization: "Basic " + enteredCreds() },
		complete: credsCallback
	});
}

var credsCallback = function(a,b,c) {
	if (b == "success") {
		updateCredsStatus("Credentials are good!");
		$("#saveDiv").show();
		$("#saveServerBtn").focus();
	} else {
		updateCredsStatus("Credentials incorrect");
	}
}

var showAddServer = function() {
	hideAll();

	$("#url").val("http://");
	hideSaveButtonAndTestStatusAndCredentials();

	$("#addServer").show();
	$("#url").focus();
}

var enteredUrl = function() {
	var a = $('<a>', { href:$("#url").val() } )[0];
	return a.origin;
}

var enteredCreds = function() {
	var username = $("#username").val();
	var password = $("#password").val();
	return btoa(username+":"+password);
}

var saveNewServer = function() {
	var server = {
		url:enteredUrl(),
		creds:enteredCreds(),
	};

	servers.push(server);

	saveConfig({servers:servers}, function() {});

	$("#addServer").hide();
  	showServerList();
}

var hideSaveButtonAndTestStatusAndCredentials = function() {
	$("#saveDiv").hide();
	$("#credsDiv").hide();
	updateTestStatus("");
	updateCredsStatus("");
}

var testCallback = function(a,b) {
	$("#test").attr("disabled", false);
	$("#test").attr("disabled", false);
	$("#url").attr("disabled", false);
	if (b == "success") {
		var teamCity = false;
		try {
			teamCity = ($(a.responseText)[1].text.search("TeamCity") > -1);
		}	catch (err) {}

		if (teamCity) {
			updateTestStatus("TeamCity found");
	    	$("#credsDiv").show();
	    	updateCredsStatus("");
	    	$("#username").focus();
	  	} 
		else {
			updateTestStatus("Found something here but not TeamCity");
		}
	}
	else {
		updateTestStatus("Didn't find anything here. Probably an invalid or inactive url");
	}	
}

var updateCredsStatus = function(status) {
	$("#credsStatus").html(status);
}

var updateTestStatus = function(status) {
	$("#testStatus").html(status);
}

var testConnection = function(event) { 
	if (!$("#url").val()) {
		updateTestStatus("Please enter a URL");	
		return;
	}

	hideSaveButtonAndTestStatusAndCredentials();
	$("#test").attr("disabled", true);
	$("#url").attr("disabled", true);
	updateTestStatus("Connecting...");

	$.ajax({
		url: enteredUrl(),
		headers: { Accept:"application/json" },
		complete: testCallback
	});
}

var exit = function() {
	window.close();
}

var urlInputChanged = function() {
	var keycode = (event.keyCode ? event.keyCode : event.which);
	var enterPressed = (keycode == '13');

	if (enterPressed) {
		$("#test").click();
	} else {
		hideSaveButtonAndTestStatusAndCredentials();
	}
}

var credsInputChanged = function() {
	var keycode = (event.keyCode ? event.keyCode : event.which);
	var enterPressed = (keycode == '13');

	if (enterPressed) {
		$("#checkCredsBtn").click();
	}
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