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
	var targalad = new Character('magus', attributes, 9, 'equipment');
	
	
	targalad.addItem(new Armor('Mithral Chainshirt +1', 'light', 4, 6, 1, 0, 15, 10));
	targalad.addItem(new Weapon('Scimitar +1, Ghost touch', WeaponType.SCIMITAR, +1, 4));
	targalad.addItem(new Item('Gloves of Dex +1', 'hands', new Bonus('DEXTERITY', BonusType.ENHANCEMENT, +1), 1));
	targalad.addItem(new Item('Belt of Str +1', 'belt',new Bonus('STRENGTH', BonusType.ENHANCEMENT, +1), 1));
	targalad.addItem(new Item('Headband of Int +2', 'headband',new Bonus('INTELLIGENCE', BonusType.ENHANCEMENT, +2), 1));
	targalad.addItem(new Item('Ring of Deflection +1', 'ring', new Bonus('ARMOR_CLASS', BonusType.DEFLECTION, +1), 0));
	targalad.addItem(new Item('Cloak of Resistance +1', 'shoulders', new Bonus('SAVES', BonusType.RESISTANCE, +1), 1));
		
	targalad.addAbility(FeatFactory.weaponFinesse(targalad));
	targalad.addAbility(FeatFactory.dervishDance(targalad));
	targalad.addAbility(FeatFactory.arcaneStrike(targalad));
	
	if (targalad.level >= 3) {
		targalad.characterClass.addArcana(MagusArcanaFactory.arcaneAccuracy(targalad));
	}
	
	if (targalad.level >= 6) {
		targalad.characterClass.addArcana(MagusArcanaFactory.empoweredMagic(targalad));
		targalad.characterClass.addArcana(MagusArcanaFactory.songOfTheBladeDance(targalad));
	}
	
	if (targalad.level >= 9) {
		targalad.characterClass.addArcana(MagusArcanaFactory.overcomeCircumstances(targalad));
	}
	
	targalad.skillSet.getSkill(SkillsEnum.ACROBATICS).addRank(3);
	targalad.skillSet.getSkill(SkillsEnum.APPRAISE).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.BLUFF).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.CLIMB).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.CRAFT_ALCHEMY).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.CRAFT_ARMOR).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.CRAFT_WEAPON).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.DIPLOMACY).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.DISABLE_DEVICE).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.DISGUISE).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.ESCAPE_ARTIST).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.FLY).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.HANDLE_ANIMAL).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.HEAL).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.INTIMIDATE).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_ARCANA).addRank(8);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_DUNGEONEERING).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_ENGINEERING).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_GEOGRAPHY).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_HISTORY).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_LOCAL).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_NATURE).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_NOBILITY).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_PLANES).addRank(7);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_RELIGION).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_MARTIAL).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.LINGUISTICS).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.PERCEPTION).addRank(8);
	targalad.skillSet.getSkill(SkillsEnum.PERFORM_DANCE).addRank(2);
	targalad.skillSet.getSkill(SkillsEnum.PERFORM_SING).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.PERFORM_ORATORY).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.PROFESSION).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.RIDE).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.SENSE_MOTIVE).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.SLEIGHT_OF_HAND).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.SPELLCRAFT).addRank(7);
	targalad.skillSet.getSkill(SkillsEnum.STEALTH).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.SURVIVAL).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.SWIM).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.USE_MAGIC_DEVICE).addRank(1);

	
	console.log(targalad);
	
	
	myCharacter = targalad;
}


function Character(characterClass, attributes, level, equipment) {
	//properties
	this.attributes = attributes;
	this.level = level;
	
	
	this.equipment = new Equipment();
	this.saves = new Saves(true, false, true, this);
	this.nonPassiveAbilities = [];
	this.passiveAbilities = [];
	this.conditions = {};
	
	
	
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
	
	this.characterClass = new Magus(this);
	this.skillSet = new SkillSet(this);
	
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
	
	this.addCondition = function(condition) {
		this.conditions[condition.name] = condition;
	};
	
	this.removeCondition = function(condition) {
		delete this.condition[condition.name];
	};
	
	
	for (var i in AbilityFactory) {
		this.addAbility(AbilityFactory[i](this));
	}
	
	var classAbilities = this.characterClass.getAllAbilities();
	for(i = 0; i < classAbilities.length; i++) {
		this.addAbility(classAbilities[i]);
	}
	
	this.getSpellBook = function() {
		return this.characterClass.spellbook;
	};
}