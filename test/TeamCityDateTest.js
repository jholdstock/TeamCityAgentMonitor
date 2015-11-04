QUnit.test("TeamCityDate : Date is zero indexed", function(assert) {
	// 10 Jan 2014 @ 18:29
	var actual = new TeamCityDate("20140110T182900+0000").getDate();
	var expected = new Date(2014, 0, 10, 18, 29, 0, 0);
	assert.deepEqual(actual, expected);

	// 10 Dec 2014 @ 18:29
	var actual = new TeamCityDate("20141210T182900+0000").getDate();
	var expected = new Date(2014, 11, 10, 18, 29, 0, 0);
	assert.deepEqual(actual, expected);
});

QUnit.test("TeamCityDate : Seconds aren't ignored", function(assert) {
	// 10 Dec 2014 @ 00:11:33
	var actual = new TeamCityDate("20141210T001133+0000").getDate();
	var expected = new Date(2014, 11, 10, 0, 11, 33, 0);
	assert.deepEqual(actual, expected);
});