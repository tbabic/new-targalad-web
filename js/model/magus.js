function Magus(character) {
	this.character = character;
	this.arcanas = [];
	this.classAbilities = [];
	this.spellbook = new SpellBook(this.character, 210, 3);
	
	this.getArcanePool = function() {
		return this.character.attributes.intelligence.getModifier() + Math.floor(this.character.level/2);
	};
	
	this.currentArcanePool = this.getArcanePool();
	
	
	if (character.level >= 1) {
		this.classAbilities.push(MagusAbilities.spellCombat(character));
	}
	if (character.level >= 2) {
		this.classAbilities.push(MagusAbilities.spellStrike(character));
	}
	if (character.level >= 4) {
		this.classAbilities.push(MagusAbilities.spellRecall(character));
	}
	if (character.level >= 7) {
		this.classAbilities.push(MagusAbilities.knowledgePool(character));
	}
	
	
	
	this.addArcana = function(arcana) {
		this.arcanas.push(arcana);
		character.addAbility(arcana);
	};
	
	this.getAllAbilities = function() {
		return this.arcanas.concat(this.classAbilities);
	};
	
	this.classSkills = [SkillsEnum.CLIMB, SkillsEnum.CRAFT_ALCHEMY, SkillsEnum.CRAFT_ARMOR, SkillsEnum.CRAFT_WEAPON, 
		SkillsEnum.FLY, SkillsEnum.INTIMIDATE, 
		SkillsEnum.KNOWLEDGE_ARCANA, SkillsEnum.KNOWLEDGE_DUNGEONEERING, SkillsEnum.KNOWLEDGE_PLANES, 
		SkillsEnum.PROFESSION, SkillsEnum.RIDE, SkillsEnum.SPELLCRAFT, SkillsEnum.SWIM, SkillsEnum.USE_MAGIC_DEVICE];
	
	this.spellsPerDay = function(spellLevel) {
		if (spellLevel > 6) {
			return;
		}
		let baseSpells = this.baseSpellsPerDay(spellLevel);
		let bonusSpells = this.bonusSpellsPerDay(spellLevel);
		return baseSpells + bonusSpells;
	};
	
	this.baseSpellsPerDay = function(spellLevel) {
		let startingLevel = (spellLevel -1)*3 + 1;
		if (this.character.level < startingLevel) {
			return undefined;
		} 
		if(spellLevel === 6) {
			return this.character.level - startingLevel + 1;
		}
		
		if (this.character.level === startingLevel) {
			return 1;
		} else if (this.character.level === startingLevel+1) {
			return 2;
		} else if (this.character.level <= startingLevel+3) {
			return 3;
		} else if (this.character.level <= startingLevel+5) {
			return 4;
		} else if (this.character.level <= startingLevel+7 && spellLevel < 5) {
			return 4;
		} else {
			return 5;
		}
	};
	

	
	this.bonusSpellsPerDay = function(spellLevel) {
		if (spellLevel === 0) {
			return 0;
		}
		let intModifier = this.character.attributes.intelligence.getModifier();
		let startingModifier = intModifier - spellLevel + 1;
		return Math.ceil(startingModifier/4);
	};
	
	let cantrips = spellsDB.getByLevel(0);
	for (let spellId in cantrips) {
		let cantrip =  cantrips[spellId];
		this.spellbook.addSpell(cantrip);
	}

	
	
}

var MagusArcanaFactory = {
	arcaneAccuracy : function(owner) {
		var bonusValue = owner.attributes.intelligence.getModifier();
		return new Ability("Arcane accuracy", ActionType.SWIFT, owner, new Bonus(BonusCategory.TO_HIT, BonusType.INSIGHT, bonusValue, "Arcane accuracy"));
	},
	empoweredMagic : function(owner) {
		return new Ability("Empowered Magic", ActionType.FREE, owner);
	},
	songOfTheBladeDance : function(owner) {
		return new Ability("Song of the Blade Dance", ActionType.SWIFT, owner, [
			new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DODGE, 2, "Song of the Blade Dance"),
			new Bonus(BonusCategory.TO_HIT, BonusType.UNTYPED, 1, "Song of the Blade Dance"),
			new Bonus(BonusCategory.INITIATIVE, BonusType.UNTYPED, 2, "Song of the Blade Dance")]);
	},
	accurateStrike : function(owner) {
		return new Ability("Accurate Strike", ActionType.SWIFT, owner);
	},
};


var MagusAbilities = {
	spellCombat : function(owner) {
		return new Ability("Spell combat", ActionType.FREE, owner, [], function(owner, extraConcentration) {
			if (extraConcentration === undefined) {
				extraConcentration = 0;
			}
			var bonusList = [new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -2-extraConcentration, "Spell Combat")];
			var improved = 0;
			if (owner.level >= 8) {
				improved = 2;
			}
			bonusList.push(new Bonus([BonusCategory.CONCENTRATION,BonusCategory.DEFENSIVE_CASTING], BonusType.CIRCUMSTANCE, improved+extraConcentration, "Spell Combat"));
			this.bonusList = new BonusEffectList(bonusList);
			this.bonusList.activate();
		}, function(){
			this.bonusList.deactivate();
		});
	},
	spellStrike : function(owner) {
		return new Ability("Spellstrike", ActionType.PASSIVE, owner);
	},
	spellRecall : function(owner) {
		return new Ability("Spell recall", ActionType.PASSIVE, owner);
	},
	knowledgePool : function(owner) {
		return new Ability("Knowledge pool", ActionType.PASSIVE, owner);
	}
};



