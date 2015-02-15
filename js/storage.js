function saveConfig(items, callback) {
  chrome.storage.local.set(items, callback);
};

function loadConfig(callback) {
  chrome.storage.local.get({
    servers: [],
    refreshRate: 10,
    successMessage: "Everything is passing",
    hideCursor: false,
    showAgents: true,
  }, callback);
};