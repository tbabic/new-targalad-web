var myCharacter;

bab = function(level) {
	return Math.floor(this.level * 0.75);
};

function createTargalad() {
	var attributes = new Attributes(10, 20, 12, 18, 10, 10);
	var targalad = new Character('magus', attributes, 7, 'equipment')
	targalad.addItem(new Armor('Mithral Chainshirt +1', 'light', 4, 6, 1, 0, 15, 10));
	targalad.addItem(new Weapon('Scimitar +1, Ghost touch', 'One-handed', 'd6', +1, 'slashing', 4));
	targalad.addItem(new Item('Gloves of Dex +1', 'hands', {category: 'dexterity', bonusType: 'enhancement', value: +1}));
	targalad.addItem(new Item('Belt of Str +1', 'hands', {category: 'strength', bonusType: 'enhancement', value: +1}));
	console.log(targalad);
	
	
	myCharacter = targalad;
}


function Character(characterClass, attributes, level, equipment) {
	//properties
	this.characterClass = characterClass;
	this.attributes = attributes;
	this.level = level;
	this.equipment = new Equipment();
	this.saves = new Saves(true, false, true, this);
	
	this.getBab = function() {
		return bab(level);
	}
	
	
	//methods
	this.recalculateCharacter = function() {
		console.log('recalculating');
	};
	
	this.addItem = function(item) {
		this.equipment.addItem(item);
		this.recalculateCharacter();
	};
	
	
	
	
}