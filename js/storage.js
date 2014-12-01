function saveItems(items, callback) {
  chrome.storage.local.set({servers:items}, function() {
    callback();
  });
};

function loadItems(callback) {
  chrome.storage.local.get({
    servers: []
  }, function(items) {
    callback(items);
  });
};