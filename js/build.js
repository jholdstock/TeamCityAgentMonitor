function Build(rawBuild) {
	this.rawBuild = null;

	this.construct = function(rawBuild) {
		this.rawBuild = rawBuild;
	};

	this.shouldBeDrawn = function() {
		if (this.neverRun()) {
			if (showNeverRunBuilds) {
				return true;
			} else {
				return false;
			}
		}

		if (this.successful() && this.includesMuted()) { 
			if (showMutedBuilds) { 
				return true;
			} else {
				return false;
			} 
		} 

		if (this.successful() == false) {
			return true;
		} else {
			return false;
		}
	}

	this.successful = function() {
		return rawBuild.status == "SUCCESS";
	}

	this.getDateAndTimeSince = function() {
		if (this.neverRun()) {
			return "";
		} else {
			var failureTime = new TeamCityDate(rawBuild.finishDate).getDate();
			var interval = new TimeInterval(new Date(), failureTime);
			var msg1 = interval.getFailureDateTime();
			var msg2 = interval.getElapsedTime() + " ago";

			return msg1 + "<br />" + msg2;
		}
	};

	this.getStatus = function() {
		if (this.neverRun()) {
			return "Build has never run";
		} else {
			return rawBuild.statusText;
		}
	}

	this.getId = function() {
		return "tsm_b_" + rawBuild.buildType.id;
	}

	this.getColor = function() {
		if (rawBuild.status == "SUCCESS" && this.includesMuted()) {
			return "orange";
		} else if (this.neverRun()) {
			return "orange";
		} else {
			return "red";
		}
	}

	this.getName = function() { 
		return rawBuild.buildType.projectName + " :: " + rawBuild.buildType.name;
	}

	this.neverRun = function() {
		return rawBuild.neverRun;
	}

	this.includesMuted = function() {
		return rawBuild.statusText && rawBuild.statusText.includes("muted");
	}

	this.construct(rawBuild);
};