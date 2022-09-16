function Saves(fortHigh, reflexHigh, willHigh, character) {
	this.fort = new Save('FORTITUDE', fortHigh, character.attributes.constitution, character);
	this.reflex = new Save('REFLEX', reflexHigh, character.attributes.dexterity, character);
	this.will = new Save('WILL', willHigh, character.attributes.wisdom, character);
	
}

function Save(type, isHigh, attribute, character) {
	this.character = character;
	this.isHigh = isHigh;
	this.type = type;
	this.attribute = attribute;
	this.value = 0;
	
	this.bonusProcessor = new BonusProcessor();
	
	this.getBaseValue = function() {
		var attrMod = attribute.getModifier();
		if (isHigh) {
			return attrMod + 2 + Math.floor(this.character.level / 2);
		} else {
			return attrMod + Math.floor(this.character.level / 3);
		}
	};
	
	this.getValue = function(){
		this.value = this.getBaseValue() + this.bonusProcessor.getValue();
		return this.value;
	};
	
	addModelListener(type, (e, bonusEffect) => {
		this.bonusProcessor.processBonusEffect(bonusEffect);
		this.getValue();
	});
	
	addModelListener("SAVES", (e, bonusEffect) => {
		this.bonusProcessor.processBonusEffect(bonusEffect);
		this.getValue();
		
	});
	
	this.value = this.getValue();
	
}