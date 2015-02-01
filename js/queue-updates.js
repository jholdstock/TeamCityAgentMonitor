var downloadAndDisplayQueue = function() {
  ajaxGet("/httpAuth/app/rest/buildQueue", function(response) {
    var queue = response.build;
    var length = 0; 
    if (queue !== undefined) {
      length = queue.length;
    }
    
    $(".tsm_queue_count").html(length);
    if (refreshQueue & !handlingError) setTimeout(downloadAndDisplayQueue, queueRefreshRate);
  });
}