$("#noServers, #serverList, #addServer").hide();
$("#test").val("Test connection");

loadItems(function(items) {
	servers = items.servers;
	showServerList();
});

var showServerList = function() {
	$("#noServers, #serverList, #addServer").hide();
	if (servers.length == 0) {
		$("#noServers").show();
		return;
	} 

	$("#serverLinks").empty();
	for(var i = 0; i < servers.length; i++) {
		var container = $("<div>").attr("id", "btn_" + i + "_link");
	
		$("<label>")
			.attr("for", "btn_" + i)
			.text(servers[i].url)
			.appendTo(container);

		container.append("<br>");

		$("<button>")
			.attr("id", "btn_" + i)
			.text("View")
			.click(serverButtonClick(servers[i].url))
			.appendTo(container);

		container.appendTo($("#serverLinks"));
	}

	$("#serverList").show();
}

var serverButtonClick = function(url) {
	return function() {
		chrome.extension.getBackgroundPage().openTab(url);
    exit();
	};
}

var showAddServer = function() {
	$("#noServers, #serverList").hide();
	// Reset form
	$("#url").val("http://");
	hideSaveButtonAndTestStatus();
	// Show form
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

	saveItems(servers, function() {});

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

$(".add").click(showAddServer);
$(".exit").click(exit);

$("#save").click(saveNewServer);
$("#cancel").click(showServerList);
$("#addServer").submit(testConnection);

$("#url").keydown(inputChanged).change(inputChanged);