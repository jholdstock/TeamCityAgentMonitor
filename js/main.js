chrome.runtime.sendMessage({}, function(response) {
  var body = $("body");
  body.empty();

    var h = $.get("http://lon1vci01.int.openbet.com/agents.html", null, function(data){
    $("<div>").text(data).appendTo(body);
  });

});