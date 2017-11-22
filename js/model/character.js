var myCharacter;




bab = function(level) {
	return Math.floor(level * 0.75);
};

ActionType = {
	PASSIVE : "PASSIVE",
	FREE : "FREE",
	SWIFT : "SWIFT",
	IMMEDIATE : "IMMEDIATE",
	MOVE : "MOVE",
	STANDARD : "STANDARD",
	FULL_ROUND : "FULL_ROUND",
	MODAL : "MODAL"
};


function createTargalad() {
	var attributes = new Attributes(10, 20, 12, 18, 10, 10);
	var targalad = new Character('magus', attributes, 8, 'equipment');
	
	
	targalad.addItem(new Armor('Mithral Chainshirt +1', 'light', 4, 6, 1, 0, 15, 10));
	targalad.addItem(new Weapon('Scimitar +1, Ghost touch', WeaponType.SCIMITAR, +1, 4));
	targalad.addItem(new Item('Gloves of Dex +1', 'hands', new Bonus('DEXTERITY', BonusType.ENHANCEMENT, +1), 1));
	targalad.addItem(new Item('Belt of Str +1', 'belt',new Bonus('STRENGTH', BonusType.ENHANCEMENT, +1), 1));
	targalad.addItem(new Item('Ring of Deflection +1', 'ring', new Bonus('ARMOR_CLASS', BonusType.DEFLECTION, +1), 0));
	targalad.addItem(new Item('Cloak of Resistance +1', 'shoulders', new Bonus('SAVES', BonusType.RESISTANCE, +1), 1));
		
	targalad.addAbility(FeatFactory.weaponFinesse(targalad));
	targalad.addAbility(FeatFactory.dervishDance(targalad));
	targalad.addAbility(FeatFactory.arcaneStrike(targalad));
	console.log(targalad);
	
	
	myCharacter = targalad;
}


function Character(characterClass, attributes, level, equipment) {
	//properties
	this.attributes = attributes;
	this.level = level;
	this.characterClass = new Magus(this);
	this.equipment = new Equipment();
	this.saves = new Saves(true, false, true, this);
	this.nonPassiveAbilities = [];
	this.passiveAbilities = [];
	
	
	
	this.getBab = function() {
		return bab(level);
	};
	
	this.getMaxArcanePool = function() {
		return this.attributes.intelligence.getModifier() + Math.floor(this.level * 0.5);
	};
	
	this.currentArcanePool = this.getMaxArcanePool();
	
	this.defense = new Defense(this);
	this.offense = new Offense(this);
	
	this.addItem = function(item) {
		this.equipment.addItem(item);
	};
	
	this.addAbility = function(ability) {
		ability.setOwner(this);
		if (ability.actionType == ActionType.PASSIVE) {
			this.passiveAbilities.push(ability);
		} else {
			this.nonPassiveAbilities.push(ability);
		}
		
	};
	
	
	
	this.deactivateAbilitiesByAction = function(actionType) {
		for (var i = 0; i < this.nonPassiveAbilities.length; i++) {
			var ability = this.nonPassiveAbilities[i];
			if (ability.actionType == actionType && ability.active) {
				ability.deactivate();
			}
		}
		
	};
	
	this.deactivateAbility = function(featId) {
		for (var i = 0; i < this.nonPassiveFeats.length; i++) {
			var feat = this.nonPassiveFeats[i];
			if (feat.id == featId && feat.active) {
				feat.deactivate();
			}
		}
		
	};
	
	
	for (var i in AbilityFactory) {
		this.addAbility(AbilityFactory[i](this));
	}
	
	var classAbilities = this.characterClass.getAllAbilities();
	for(i = 0; i < classAbilities.length; i++) {
		this.addAbility(classAbilities[i]);
	}
	
	
	
}