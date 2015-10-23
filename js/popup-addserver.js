var urlInputChanged = function() {
  if (enterPressed()) {
    $("#test").click();
  } else {
    hideSaveButtonAndTestStatusAndCredentials();
  }
}

var credsInputChanged = function() {
  if (enterPressed()) {
    $("#checkCredsBtn").click();
  }
}

var enterPressed = function() {
  var keycode = (event.keyCode ? event.keyCode : event.which);
  return (keycode == '13');
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

var testCallback = function(a,b) {
  $("#test").attr("disabled", false);
  $("#test").attr("disabled", false);
  $("#url").attr("disabled", false);
  if (b == "success") {
    var teamCity = false;
    try {
      teamCity = ($(a.responseText)[1].text.search("TeamCity") > -1);
    } catch (err) {}

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

var credsCallback = function(a,b,c) {
  if (b == "success") {
    updateCredsStatus("Credentials are good!");
    $("#saveDiv").show();
    $("#saveServerBtn").focus();
  } else {
    updateCredsStatus("Credentials incorrect");
  }
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
    url: enteredUrl()+"/ajax.html?logout=1",
    complete: function() {
      $.ajax({
        url: enteredUrl()+"/httpAuth/app/rest/buildTypes",
        headers: { Accept:"application/json", Authorization: "Basic " + enteredCreds() },
        complete: credsCallback
      });
    },
  }); 
}
