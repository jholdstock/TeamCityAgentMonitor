function updateClock() {
	var now = new DateTimeFormatter(new Date());

	$("#tsm_clock").html(now.getDate() + " - " + now.getTimeWithSeconds());
 }

$(document).ready(function() {
	updateClock();
	setInterval('updateClock()', 1000);
});
