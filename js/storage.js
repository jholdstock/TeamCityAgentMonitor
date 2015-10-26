function saveConfig(items, callback) {
  chrome.storage.local.set(items, callback);
};

function loadConfig(callback) {
  chrome.storage.local.get({
	servers       : [],
	refreshRate   : 15,
	successMessage: "Everything is passing",
	hideCursor    : false,
	showAgents    : true,
	showNeverRun  : true,
	showMuted     : true,
  }, callback);
};