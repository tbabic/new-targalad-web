function Attributes(strength, dexterity, constitution, intelligence, wisdom, charisma) {
	this.strength = new Attribute('STRENGTH', strength);
	this.dexterity = new Attribute('DEXTERITY', dexterity);
	this.constitution = new Attribute('CONSTITUTION', constitution);
	this.intelligence = new Attribute('INTELLIGENCE', intelligence);
	this.wisdom = new Attribute('WISDOM', wisdom);
	this.charisma = new Attribute('CHARISMA', charisma);
	
	this.getValue = function(attribute) {
		return this[attribute].getValue();
	};
	
	this.getModifier=function(attribute) {
		return this[attribute].getModifier();
	};
	
	this.getAttribute = function(type) {
		return this[type.toLowerCase()];
	};
	
	this.serialize = function() {
		JSON.stringify({
			strength:this.strength.serialize(),
			dexterity:this.dexterity.serialize(),
			constitution:this.constitution.serialize(),
			intelligence:this.intelligence.serialize(),
			wisdom:this.wisdom.serialize(),
			charisma:this.charisma.serialize(),
		});
	};
	
}

function Attribute(type, value) {
	this.type = type;
	this.value = value;
	this.bonusProcessor = new BonusProcessor();
	
	this.getModifier = function(){
		return Math.floor((this.getValue()-10)/2);
	};
	
	this.getValue = function(){
		return this.bonusProcessor.getValue() + this.value;
	};
	
	addModelListener(this.type, (e, bonusEffect) => {
		this.bonusProcessor.processBonusEffect(bonusEffect);
		triggerViewChange("ATTRIBUTES");
	});
	
}