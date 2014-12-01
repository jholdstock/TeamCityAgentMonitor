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
		$("<button>").attr("id", "btn_" + i).text(servers[i].url).appendTo($("#serverLinks"));
		$("#serverLinks").append("&nbsp;&nbsp;");
	}

	$("#serverList").show();
}

var showAddServer = function() {
	$("#noServers, #serverList").hide();
	// Reset form
	$("#url").val("http://");
	hideSaveButtonAndTestStatus();
	// Show form
	$("#addServer").show();
}

var saveNewServer = function() {
	var server = {
		url:$("#url").val()
	};
	servers.push(server);

	saveItems(servers, function() {
		//callback
	})

	$("#addServer").hide();
  showServerList();
}

var hideSaveButtonAndTestStatus = function() {
	$("#saveDiv").hide();
	updateStatus("");
}

var testCallback = function(a,b) {
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
		
	$("#test").attr("disabled", false);
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
    url: $("#url").val(),
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

$("#addFirst").click(showAddServer);
$("#add").click(showAddServer);
$("#save").click(saveNewServer);
$("#close").click(exit);
$("#cancel").click(exit);
$("#exit").click(exit);
$("#addServer").submit(testConnection);
$("#url").keydown(inputChanged);
$("#url").change(inputChanged);