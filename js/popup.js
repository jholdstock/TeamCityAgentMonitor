var hideAll = function() {
	$("#noServers, #serverList, #addServer, #settings").hide();	
}
hideAll();

loadConfig(function(items) {
	servers = items.servers;
	config = items;
  $('#refreshRate').val(items.refreshRate);
  $('#successMessage').val(items.successMessage);
  $('#hideCursor').prop("checked", items.hideCursor);
	showServerList();
});

$('#saveSettingsBtn').on('click', function() {
  saveConfig({
    refreshRate   : $('#refreshRate').val(),
    successMessage: $('#successMessage').val(),
    hideCursor    : $('#hideCursor').prop("checked"),
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
	$("#serverLinks").append($("<table>").attr("id", "serverTable").css("padding", "0.5rem 0 1rem"));
	$.each(servers, function(index, server){
		var container = $("<tr>");
	
		var name = $("<td>")
			.text(server.url)
			.append("&nbsp;&nbsp;&nbsp;")
			.css("padding", "1rem 0");

		var button = $("<td>").append(
			$("<button>")
				.text("View")
				.click(serverButtonClick(server.url))
			);

		container.append(name).append(button).appendTo($("#serverTable"));
	});
	
	$("#serverList").show();
}

var serverButtonClick = function(url) {
	return function() {
		chrome.extension.getBackgroundPage().openTab(url, config);
    exit();
	};
}

var showAddServer = function() {
	hideAll();

	$("#url").val("http://");
	hideSaveButtonAndTestStatus();

	$("#addServer").show();
}

var enteredUrl = function() {
	var a = $('<a>', { href:$("#url").val() } )[0];
  return a.origin;
}

var saveNewServer = function() {
	var server = {
		url:enteredUrl()
	};

	servers.push(server);

	saveConfig({servers:servers}, function() {});

	$("#addServer").hide();
  showServerList();
}

var hideSaveButtonAndTestStatus = function() {
	$("#saveDiv").hide();
	updateStatus("");
}

var testCallback = function(a,b) {
	$("#test").attr("disabled", false);
	if (b == "success") {
		var teamCity = false;
		try {
			teamCity = ($(a.responseText)[1].text.search("TeamCity") > -1);
		}	catch (err) {}

		if (teamCity) {
			updateStatus("TeamCity found");
	    $("#saveDiv").show();
	  } 
		else {
			updateStatus("Found something here but not TeamCity");
		}
	}
	else {
		updateStatus("Didn't find anything here. Probably an invalid or inactive url");
	}	
}

var updateStatus = function(status) {
	$("#testStatus").html(status);
}

var testConnection = function(event) { 
	event.preventDefault();
	hideSaveButtonAndTestStatus();
	$("#test").attr("disabled", true);
	updateStatus("Connecting...");

	$.ajax({
    url: enteredUrl(),
    headers: { Accept:"application/json" },
    complete: testCallback
  });
}

var exit = function() {
	window.close();
}

var inputChanged = function() {
	hideSaveButtonAndTestStatus();
}

$(".addServerBtn").click(showAddServer);
$(".exit").click(exit);
$("#saveServerBtn").click(saveNewServer);
$(".showServersBtn").click(showServerList);
$(".settingsBtn").click(showSettings);
$("#addServer").submit(testConnection);
$("#url").keydown(inputChanged).change(inputChanged);