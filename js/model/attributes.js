attrBonus = function(value) {
	return Math.floor((value-10)/2);
}

function Attributes(strength, dexterity, constitution, intelligence, wisdom, charisma) {
	this.strength = strength;
	this.dexterity = dexterity;
	this.constitution = constitution;
	this.intelligence = intelligence;
	this.wisdom = wisdom;
	this.charisma = charisma;
	
	this.getValue = function(attribute) {
		return this[attribute];
	}
	
	this.getBonus=function(attribute) {
		return attrBonus(this.getValue(attribute));
	}
	
}

function Attribute(type, value) {
	this.value = value;
	this.bonusList = [];
	
	this.addBonus = function(bonus) {
		this.bonusList.push(bonus);
	}
}