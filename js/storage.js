function saveInStorage(items, callback) {
  chrome.storage.local.set({servers:items}, function() {
    callback();
  });
};

function loadFromStorage(callback) {
  chrome.storage.local.get({
    servers: []
  }, function(items) {
    callback(items);
  });
};