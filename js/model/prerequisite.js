function NoPrereq() {
	
	this.check = function(character) {
		return true;
	};
}

function BabPrereq(prereqValue) {
	this.prereqValue = prereqValue;
	
	this.check = function(character) {
		return character.getBab() >= prereqValue;
	};
}


function LevelPrereq(prereqValue) {
	this.prereqValue = prereqValue;
	
	this.check = function(character) {
		return character.getLevel() >= prereqValue;
	};
}

function ClassLevelPrereq(characterClass, prereqValue) {
	this.characterClass = characterClass;
	this.prereqValue = prereqValue;
	
	this.check = function(character) {
		return character.getClass(characterClass).getLevel() >= prereqValue;
	};
}

function CasterLevelPrereq(prereqValue) {
	this.prereqValue = prereqValue;
	
	this.check = function(character) {
		return character.getCasterLevel() >= prereqValue;
	};
}


function ArcaneSpellLevelPrereq(prereqValue) {
	this.prereqValue = prereqValue;
	
	this.check = function(character) {
		return character.getMaxArcaneSpellLevel() >= prereqValue;
	};
}

function MultiAnyPrereq(prereqs) {
	this.prereqs = Array.isArray(prereqs) ? prereqs : [prereqs];
	
	this.check = function(character) {
		for (let i = 0; i < this.prereqs.length; i++) {
			if (this.check(character)) {
				return true;
			}
		}
		return false;
	};
	
	this.addPrereq = function(prereq) {
		this.prereqs.push(prereq);
	};
	
}

function MultiAllPrereq(prereqs) {
	this.prereqs = Array.isArray(prereqs) ? prereqs : [prereqs];
	
	this.check = function(character) {
		for (let i = 0; i < this.prereqs.length; i++) {
			if (!this.check(character)) {
				return false;
			}
		}
		return true;
	};
	
	this.addPrereq = function(prereq) {
		this.prereqs.push(prereq);
	};
	
	
}