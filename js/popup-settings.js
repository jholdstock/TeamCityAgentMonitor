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