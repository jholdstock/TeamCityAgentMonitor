var now  = new Date(2014, 0, 10, 18, 30, 0, 0);

QUnit.test("Less than a minute", function(assert) {
	var then = new Date(2014, 0, 10, 18, 29, 15, 0);
	var actual = getElapsedTime(now, then);
	var expected = "Less than a minute";
  assert.equal(actual, expected);
});

QUnit.test("One minute", function(assert) {
	var then = new Date(2014, 0, 10, 18, 29, 0, 0);
	var actual = getElapsedTime(now, then);
	var expected = "1 minute";
  assert.equal(actual, expected);
});

QUnit.test("Single hour and minute", function(assert) {
	var then = new Date(2014, 0, 10, 17, 29, 0, 0);
	var actual = getElapsedTime(now, then);
	var expected = "1 hour 1 minute";
  assert.equal(actual, expected);
});

QUnit.test("Single day and hour", function(assert) {
	var then = new Date(2014, 0, 09, 17, 30, 0, 0);
	var actual = getElapsedTime(now, then);
	var expected = "1 day 1 hour";
  assert.equal(actual, expected);
});

QUnit.test("Multiple days and hours", function(assert) {
	var then = new Date(2014, 0, 07, 07, 30, 0, 0);
	var actual = getElapsedTime(now, then);
	var expected = "3 days 11 hours";
  assert.equal(actual, expected);
});

QUnit.test("Multiple hours and minutes", function(assert) {
	var then = new Date(2014, 0, 10, 13, 11, 0, 0);
	var actual = getElapsedTime(now, then);
	var expected = "5 hours 19 minutes";
  assert.equal(actual, expected);
});

QUnit.test("Hours and no minutes", function(assert) {
	var then = new Date(2014, 0, 10, 14, 30, 0, 0);
	var actual = getElapsedTime(now, then);
	var expected = "4 hours";
  assert.equal(actual, expected);
});

QUnit.test("Days and no hours", function(assert) {
 	var then = new Date(2014, 0, 07, 18, 30, 0, 0);
	var actual = getElapsedTime(now, then);
	var expected = "3 days";
  assert.equal(actual, expected);
});