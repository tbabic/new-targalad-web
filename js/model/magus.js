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
		return getAbilityBuilder()
			.name("Arcane accuracy")
			.actionType(ActionType.SWIFT)
			.activate(function() {
				let bonusValue = this.owner.attributes.intelligence.getModifier();
				this.bonusEffectList = new BonusEffectList(this, new Bonus(BonusCategory.TO_HIT, BonusType.INSIGHT, bonusValue, this.name));
				this.bonusEffectList.activate();
			})
			.deactivate(function() {
				if (this.bonusEffectList !== undefined) {
					this.bonusEfectList.deactivate();
				}
			})
			.owner(owner)
			.get();
	},
	
	empoweredMagic : function(owner) {
		return getAbilityBuilder()
			.name("Empowered Magic")
			.actionType(ActionType.SWIFT)
			.owner(owner)
			.get();
	},
	
	songOfTheBladeDance : function(owner) {
		return getAbilityBuilder()
			.name("Song of the Blade Dance")
			.actionType(ActionType.SWIFT)
			.properties(new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DODGE, 2, "Song of the Blade Dance"))
			.properties(new Bonus(BonusCategory.TO_HIT, BonusType.UNTYPED, 1, "Song of the Blade Dance"))
			.properties(new Bonus(BonusCategory.INITIATIVE, BonusType.UNTYPED, 2, "Song of the Blade Dance"))
			.owner(owner)
			.get();
		
	},
	
	overcomeCircumstances : function(owner) {
		return getAbilityBuilder()
			.name("Overcome Circumstances")
			.actionType(ActionType.FREE)
			.owner(owner)
			.get();
	},
	
};

var MagusAbilities = {
		
	spellCombat : function(owner) {
		
		return getAbilityBuilder()
			.name("Spell combat")
			.actionType(ActionType.FREE)
			.activationOptions(new AbilityOption("Defensive casting bonus", "range", () => {
				let intModifier = owner.attributes.intelligence.getModifier();
				return "0-"+intModifier;
			}))
			.activate(function(activationOption) {
				let extraConcentration = (activationOption.value !== undefined) ? +activationOption.value : 0;
				
				this.bonusEffectList = new BonusEffectList(this, new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -2-extraConcentration, this.name));
				let improved = 0;
				if (this.owner.level >= 8) {
					improved = 2;
				}
				this.bonusEffectList.add(new Bonus([BonusCategory.CONCENTRATION,BonusCategory.DEFENSIVE_CASTING], BonusType.CIRCUMSTANCE, improved+extraConcentration, this.name));
				this.bonusEffectList.activate();
			})
			.deactivate(function(){
				if (this.bonusEffectList !== undefined) {
					this.bonusEffectList.deactivate();
				}
				
			})
			.owner(owner)
			.get();
	},
		

	spellStrike : function(owner) {
		return getAbilityBuilder()
			.name("Spellstrike")
			.actionType(ActionType.PASSIVE)
			.owner(owner)
			.get();
	},
	spellRecall : function(owner) {
		return getAbilityBuilder()
			.name("Empowered Magic")
			.actionType(ActionType.SWIFT)
			.owner(owner)
			.get();
	},
	knowledgePool : function(owner) {
		return getAbilityBuilder()
			.name("Knowledge pool")
			.actionType(ActionType.PASSIVE)
			.owner(owner)
			.get();
	}
		
};


//
//var MagusAbilities = {
//	spellCombat : function(owner) {
//		return new Ability("Spell combat", ActionType.FREE, owner, [], function(owner, extraConcentration) {
//			if (extraConcentration === undefined) {
//				extraConcentration = 0;
//			}
//			var bonusList = [new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -2-extraConcentration, "Spell Combat")];
//			var improved = 0;
//			if (owner.level >= 8) {
//				improved = 2;
//			}
//			bonusList.push(new Bonus([BonusCategory.CONCENTRATION,BonusCategory.DEFENSIVE_CASTING], BonusType.CIRCUMSTANCE, improved+extraConcentration, "Spell Combat"));
//			this.bonusList = new BonusEffectList(this, bonusList);
//			this.bonusList.activate();
//		}, function(){
//			this.bonusList.deactivate();
//		});
//	},
//	spellStrike : function(owner) {
//		return new Ability("Spellstrike", ActionType.PASSIVE, owner);
//	},
//	spellRecall : function(owner) {
//		return new Ability("Spell recall", ActionType.PASSIVE, owner);
//	},
//	knowledgePool : function(owner) {
//		return new Ability("Knowledge pool", ActionType.PASSIVE, owner);
//	}
//};



