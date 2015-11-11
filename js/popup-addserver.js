var urlInputChanged = function() {
  if (enterPressed()) {
    $("#test").click();
  } else {
    hideSaveButtonAndTestStatusAndCredentials();
  }
}

var usernameInputChanged = function() {
  if (enterPressed()) {
    $("#password").focus();
  }
}

var passwordInputChanged = function() {
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

var checkEnteredUrl = function(event) { 
  if (!$("#url").val()) {
    updateTestStatus("Please enter a URL"); 
    return;
  }

  var url = enteredUrl();
  var matchFound = false;
  $.each(servers, function(i, el){
    if (el.url == url) {
      matchFound = true;
    }
  });

  if (matchFound) {
    alert("This server has already been added!");
    return;
  }

  hideSaveButtonAndTestStatusAndCredentials();
  $("#test").attr("disabled", true);
  $("#url").attr("disabled", true);
  updateTestStatus("Connecting...");

  var tc = new TeamCityClient(url, "");
  tc.testConnection(testCallback);
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

var chooseProjects = function() {
  hideAll();
  editingExistingProjectPreferences = false;
  $("#projectCheckboxes").empty();
  
  var tc = new TeamCityClient(enteredUrl(), enteredCreds());
  tc.getProjects(projectsCallback);
}

var credsCallback = function(a,b,c) {
  $("#checkCredsBtn").attr("disabled", false);

  if (b == "success") {
    updateCredsStatus("Credentials are good!");
    $("#chooseProjectsBtn").show().focus();
  } else {
    updateCredsStatus("Credentials incorrect");
  }
}

var checkCreds = function() {
  $("#checkCredsBtn").attr("disabled", true);
  if (!$("#username").val()) {
    updateCredsStatus("Please enter a username"); 
    $("#checkCredsBtn").attr("disabled", false);
    return;
  }
  if (!$("#password").val()) {
    updateCredsStatus("Please enter a password"); 
    $("#checkCredsBtn").attr("disabled", false);
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
