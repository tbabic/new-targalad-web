highSave = function(level) {
	return 2 + Math.floor(this.level / 2);
};

lowSave = function(level) {
	return Math.floor(this.level / 3);
};

function Saves(fortHigh, reflexHigh, willHigh, character) {
	this.fort = Save('fort', fortHigh, character);
	this.reflex = Save('reflex', reflexHigh, character);
	this.will = Save('will', willHigh, character);
	
}

function Save(type, isHigh, character) {
	this.character = character;
	this.isHigh = isHigh;
	this.type = type;
	
	this.getValue = function(){
		var base = isHigh ? highSave(character.level) : lowSave(character.level);
		var bonus = 0;
		for (var slot in character.equipment) {
			var item = character.equipment[slot];
			for (var property in item) {
				if (property.category == 'saves') {
					if (property.value > bonus) {
						bonus = property.value;
					}
				}
			}
		}
		if (this.type == 'reflex') {
			bonus += character.attributes.getBonus('dexterity');
		}
		if (this.type == 'will') {
			bonus += character.attributes.getBonus('wisdom');
		}
		if (this.type == 'fort') {
			bonus += character.attributes.getBonus('constitution');
		}
		return base + bonus;
	}
	
}