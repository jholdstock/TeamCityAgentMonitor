var now  = new Date(2014, 0, 10, 18, 30, 0, 0);

var test_getElapsedTime = function(then, expected, assert) {
	var ti = new TimeInterval(now, then);
	var actual = ti.getElapsedTime();
  	assert.equal(actual, expected);
}

QUnit.test("TimeInterval : getElapsedTime : Less than a minute", function(assert) {
	var then = new Date(2014, 0, 10, 18, 29, 15, 0);
	test_getElapsedTime(then, "Less than a minute", assert);
});

QUnit.test("TimeInterval : getElapsedTime : One minute", function(assert) {
	var then = new Date(2014, 0, 10, 18, 29, 0, 0);
	test_getElapsedTime(then, "1 minute", assert);
});

QUnit.test("TimeInterval : getElapsedTime : Single hour and minute", function(assert) {
	var then = new Date(2014, 0, 10, 17, 29, 0, 0);
	test_getElapsedTime(then, "1 hour 1 minute", assert);
});

QUnit.test("TimeInterval : getElapsedTime : Single day and hour", function(assert) {
	var then = new Date(2014, 0, 09, 17, 30, 0, 0);
	test_getElapsedTime(then, "1 day 1 hour", assert);
});

QUnit.test("TimeInterval : getElapsedTime : Multiple days and hours", function(assert) {
	var then = new Date(2014, 0, 07, 07, 30, 0, 0);
	test_getElapsedTime(then, "3 days 11 hours", assert);
});

QUnit.test("TimeInterval : getElapsedTime : Multiple hours and minutes", function(assert) {
	var then = new Date(2014, 0, 10, 13, 11, 0, 0);
	test_getElapsedTime(then, "5 hours 19 minutes", assert);
});

QUnit.test("TimeInterval : getElapsedTime : Hours and no minutes", function(assert) {
	var then = new Date(2014, 0, 10, 14, 30, 0, 0);
	test_getElapsedTime(then, "4 hours", assert);
});

QUnit.test("TimeInterval : getElapsedTime : Days and no hours", function(assert) {
 	var then = new Date(2014, 0, 07, 18, 30, 0, 0);
	test_getElapsedTime(then, "3 days", assert);
});

var test_getFailureDateTime = function(then, expected, assert) {
	var ti = new TimeInterval(now, then);
	var actual = ti.getFailureDateTime();
  assert.equal(actual, expected);
}

QUnit.test("TimeInterval : getFailureDateTime : 24 hour format", function(assert) {
 	var then = new Date(2014, 0, 07, 18, 30, 0, 0);
	test_getFailureDateTime(then, "Failed on 7 Jan 2014 at 18:30", assert);
});

QUnit.test("TimeInterval : getFailureDateTime : Numbers are padded with zero", function(assert) {
 	var then = new Date(2014, 0, 07, 8, 3, 0, 0);
	test_getFailureDateTime(then, "Failed on 7 Jan 2014 at 08:03", assert);
});