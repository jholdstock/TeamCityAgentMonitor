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
	$("#url, #username, #password").val("");
	$("#saveDiv").hide();
	// Show form
	$("#addServer").show();
}

var saveNewServer = function() {
	var server = {
		url:$("#url").val(),
		username:$("#username").val(),
		password:$("#password").val()
	};
	servers.push(server);

	saveItems(servers, function() {
		//callback
	})

	$("#addServer").hide();
  showServerList();
}

var testConnection = function(event) { 
	event.preventDefault();
	$("#saveDiv").hide();
	
	//test
	if (true) {
		$("#saveDiv").show();
	} else {
		
	}
}

var exit = function() {
	window.close();
}

var inputChanged = function() {
	$("#saveDiv").hide();
}

$("#addFirst").click(showAddServer);
$("#add").click(showAddServer);
$("#save").click(saveNewServer);
$("#close").click(exit);
$("#cancel").click(exit);
$("#exit").click(exit);
$("#addServer").submit(testConnection);

$("#url, #username, #password").keydown(inputChanged);
$("#url, #username, #password").focus(inputChanged);