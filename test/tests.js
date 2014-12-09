var runTest = function(input, expectedOutput, assert) {
	// 10 Jan 2014 @ 18:30
	var now = new Date(2014, 0, 10, 18, 30, 0, 0);
	var actual = getFailureDateTime(now, input);
  assert.equal(actual, expectedOutput);
}

QUnit.test("One minute", function(assert) {
	runTest( 
		"20140110T182900+0000", 
		"Failed on 10 Jan 2014 at 18:29<br>1 minute ago",
		assert);
});

QUnit.test("Single hour and minute", function(assert) {
	runTest( 
		"20140110T172900+0000", 
		"Failed on 10 Jan 2014 at 17:29<br>1 hour 1 minute ago",
		assert);
});

QUnit.test("Single day and hour", function(assert) {
	runTest( 
		"20140109T173000+0000", 
		"Failed on 09 Jan 2014 at 17:30<br>1 day 1 hour ago",
		assert);
});

QUnit.test("Multiple days and hours", function(assert) {
	runTest( 
		"20140107T073000+0000", 
		"Failed on 07 Jan 2014 at 07:30<br>3 days 11 hours ago",
		assert);
});

QUnit.test("Multiple hours and minutes", function(assert) {
	runTest( 
		"20140110T131100+0000",
		"Failed on 10 Jan 2014 at 13:11<br>5 hours 19 minutes ago",
		assert);
});

// TODO: FIX BELOW
QUnit.test("Hours and no minutes", function(assert) {
	runTest( 
		"20140110T143000+0000",
		"Failed on 10 Jan 2014 at 14:30<br>4 hours 0 minute ago",
		assert);
});

QUnit.test("Days and no hours", function(assert) {
  runTest( 
		"20140107T183000+0000",
		"Failed on 07 Jan 2014 at 18:30<br>3 days 0 hour ago",
		assert);
});

QUnit.test("Less than a minute", function(assert) {
	runTest( 
		"20140110T182930+0000", 
		"Failed on 10 Jan 2014 at 18:29<br>1 minute ago",
		assert);
});