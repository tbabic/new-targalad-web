function AnimalCompanion(character) {
	this.character = character;
	this.classAbilities = [];
	this.saves = new Saves(true, true, false,  this.character);
	
	this.getBab = function(level) {
		return Math.floor(level * 0.75);
	};
	
	this.classAbilities.push(AnimalCompanionAbilities.progressionBonuses(character));

	
	this.getAllAbilities = function() {
		return this.classAbilities;
	};
	
	this.classSkills = [];
	
};

function animalCompanionHD(level) {
	let map = {
		1 : 2,
		2 : 3,
		3 : 3,
		4 : 4,
		5 : 5,
		6 : 6,
		7 : 6,
		8 : 7,
		9 : 8,
		10 : 9,
		11 : 9,
		12 : 10,
		13 : 11,
		14 : 12,
		15 : 12,
		16 : 13,
		17 : 14,
		18 : 15,
		19 : 15,
		20 : 16
	};
	
	return map[+level];
}



function createAnimalCompanionGriffin(level) {
	if (level == undefined) {
		level = 7;
	}
	
	let hd = animalCompanionHD(level);
	
	
	
	let attributes = new Attributes(16, 15, 16, 5, 13, 8);
	let pfdChar = new Character('animal-companion', attributes, +hd, 'equipment');
	pfdChar.masterLevel = level;
	
	pfdChar.addItem(new Weapon('Natural attack', WeaponType.NATURAL_ATTACK, 0));
	
	let companionAbility =  getAbilityBuilder()
			.name("animal-companion")
			.actionType(ActionType.PASSIVE)
			.activate(function() {
				this.bonusEffectList = new BonusEffectList(this, new Bonus(BonusCategory.ARMOR_CLASS, "NATURAL_ARMOR_INHERENT", 4, this.name));
				this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -1, this.name)); // large size penalty to ac
				this.bonusEffectList.add(new Bonus(BonusCategory.ARMOR_CLASS, BonusType.PENALTY, -1, this.name)); // large size penalty to hit
				this.bonusEffectList.add(new Bonus(BonusCategory.CMB, BonusType.SIZE, 2, this.name)); //large size bonus to cmb +1 to compensate penalty to hit
				this.bonusEffectList.add(new Bonus(BonusCategory.CMD, BonusType.SIZE, 2, this.name)); //large size bonus to cmd +1 to compensate penalty ac
				this.bonusEffectList.activate();
			})
			.owner(pfdChar)
			.get();
	
	pfdChar.addAbility(companionAbility);
	pfdChar.addAbility(AnimalCompanionAbilities.progressionBonuses(pfdChar));
	naturalAttacks = AnimalCompanionAbilities.naturalAttacks(pfdChar);
	naturalAttacks.numberOfAttacks = 2;
	pfdChar.addAbility(naturalAttacks);
	
	if (hd >= 4) {
		attributes.dexterity.value = 16;
	}
	
	if (level >= 7) {
		
	
		let advancementAbility = getAbilityBuilder()
				.name("animal-companion-advancement")
				.actionType(ActionType.PASSIVE)
				.activate(function() {
					this.bonusEffectList = new BonusEffectList(this, new Bonus(BonusCategory.ARMOR_CLASS, "NATURAL_ARMOR_INHERENT", 6, this.name));
					this.bonusEffectList.add(new Bonus(["STRENGTH", "CONSTITUTION"], BonusType.UNTYPED, 2, this.name));
					this.bonusEffectList.activate();
				})
				.owner(pfdChar)
				.get();
		pfdChar.addAbility(advancementAbility);
	}
	
	if (hd >= 8) {
		attributes.strength.value++;
	}
	
	
	pfdChar.addAbility(FeatFactory.powerAttack(pfdChar));
	
	pfdChar.addAbility(FeatFactory.outflank(pfdChar));
	pfdChar.addAbility(FeatFactory.preciseStrike(pfdChar));
	pfdChar.addAbility(HunterAbilities.animalFocus(pfdChar));

	loadEquipmentFromStorage(pfdChar);
	
	
	
	console.log(pfdChar);
	
	
	myCharacter = pfdChar;
}

var AnimalCompanionAbilities = {
			
	progressionBonuses : function(owner) {
			return getAbilityBuilder()
				.name("animal-progression")
				.actionType(ActionType.PASSIVE)
				.activate(function() {
					if (owner.masterLevel == null) {
						return;
					}
					let bonusIncrement = Math.floor(owner.masterLevel/3);
					this.bonusEffectList = new BonusEffectList(this, new Bonus(["STRENGTH", "DEXTERITY"], BonusType.UNTYPED, bonusIncrement, this.name));
					this.bonusEffectList.add(new Bonus(BonusCategory.ARMOR_CLASS, "NATURAL_ARMOR_PROGRESSION", bonusIncrement * 2, this.name)); // large size penalty to ac
					this.bonusEffectList.activate();
				})
				.owner(owner)
				.get();
		},
	
	pounce : function(owner) {
			return getAbilityBuilder()
				.name("Pounce")
				.actionType(ActionType.PASSIVE)
				.activate(function() {
					
				})
				.owner(owner)
				.get();
		},
		
	rake : function(owner) {
			return getAbilityBuilder()
				.name("Studied Target")
				.actionType(ActionType.PASSIVE)
				.activate(function() {
					
				})
				.owner(owner)
				.get();
		},
	naturalAttacks : function(owner) {
			return getAbilityBuilder()
				.name("natural-attacks")
				.actionType(ActionType.PASSIVE)
				.activate(function() {
					let number = this.numberOfAttacks;
					let penalty = 0;
					if (this.owner.getAbilityByName("Multiattack") != null) {
						penalty = -2;
					}
					for (i = 1; i <= number; i++) {
						
						this.extraAttackBonus = new ExtraAttackBonus(this.name + " " +i, "mainHand");
						triggerModelChange("EXTRA_ATTACK", this.extraAttackBonus);
					}
				})
				.owner(owner)
				.get();
		},
		
	multiattack : function(owner) {
			return getAbilityBuilder()
				.name("Multiattack")
				.actionType(ActionType.PASSIVE)
				.activate(function() {
					
				})
				.owner(owner)
				.get();
		},

};
