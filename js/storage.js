function saveConfig(items, callback) {
  chrome.storage.local.set(items, callback);
};

function loadConfig(callback) {
  chrome.storage.local.get({
	servers       : [],
	refreshRate   : 15,
	successMessage: "All builds are passing",
	hideCursor    : false,
	showAgents    : true,
	showNeverRun  : true,
	showMuted     : true,
	showSuccessful: false,
  }, callback);
};