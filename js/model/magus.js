function Magus(character) {
	this.character = character;
	this.arcanas = [];
	this.classAbilities = [];
	this.spellbook = new SpellBook(this.character, 210, 3);
	this.memorizedSpells = new MemorizedSpells(this.character);
	
	this.getArcanePool = function() {
		return this.character.attributes.intelligence.getModifier() + Math.floor(this.character.level/2);
	};
	
	this.currentArcanePool = this.getArcanePool();
	
	
	if (character.level >= 1) {
		this.classAbilities.push(MagusAbilities.spellCombat(character));
		this.classAbilities.push(MagusAbilities.arcanePool(character));
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
		if(baseSpells === undefined) {
			return 0;
		}
		let bonusSpells = this.bonusSpellsPerDay(spellLevel);
		return baseSpells + bonusSpells;
	};
	
	this.maxSpellLevel = function() {
		return 6;
	}
	
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
					this.bonusEffectList.deactivate();
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
	
	blackBladeStrike : function(owner) {
		var damageBonus = 1;
		if (owner.level > 5 ) {
			damageBonus = 2;
		}
		if (owner.level > 9 ) {
			damageBonus = 3;
		}
		if (owner.level > 13 ) {
			damageBonus = 4;
		}
		if (owner.level > 17 ) {
			damageBonus = 5;
		}
		return getAbilityBuilder()
			.name("Black Blade Strike")
			.actionType(ActionType.FREE)
			.properties(new Bonus(BonusCategory.DAMAGE, BonusType.UNTYPED, 1, "Black Blade Strike"))
			.owner(owner)
			.get();
		
	},
	
};

var MagusAbilities = {
		
	arcanePool : function(owner) {
		return getAbilityBuilder()
			.name("Enhance Weapon")
			.actionType(ActionType.FREE)
			.activationOptions(function () {
				let level = this.ability.owner.level;
				let options = [];
				let enhancement = 0;
				let maxEnhancement = Math.floor((level -1) / 4) +1; 
				options.push(new AbilityOption("Enhancement", "range", "0-"+maxEnhancement));
				
				if (level >= 5) {
					options.push(new AbilityOption("Flaming", "boolean", "[0,1]" ));
					options.push(new AbilityOption("Flaming burst", "boolean", "[0,2]" ));
					options.push(new AbilityOption("Shocking", "boolean", "[0,1]"));
					options.push(new AbilityOption("Shocking burst", "boolean","[0,2]"));
					options.push(new AbilityOption("Frost", "boolean","[0,1]"));
					options.push(new AbilityOption("Icy burst", "boolean", "[0,2]"));
					options.push(new AbilityOption("Keen", "boolean", "[0,1]"));
				}
				if (level >= 9) {
					options.push(new AbilityOption("Speed", "boolean", "[0,3]"));
				}
				if (level >= 13) {
					options.push(new AbilityOption("Dancing", "boolean", "[0,4]"));
				}
				if (level >= 17) {
					options.push(new AbilityOption("Vorpal", "boolean", "[0,5]"));
				}
				return options;
				
			})
			.validateActivation(function(activationOptions) {
				let totalEnhancement = 0;
				for(let i = 0; i< activationOptions.length; i++) {
					let selected = activationOptions[i];			
					totalEnhancement += +selected.value;
				}
				let maxEnhancement = Math.floor((this.ability.owner.level -1) / 4) +1; 
				return totalEnhancement <= maxEnhancement;
			})
			.activate(function(...activationOptions) {
				if (activationOptions === undefined) {
					return;
				}
				this.bonusEffectList = new BonusEffectList(this);
				let poolCost = 1;
				for(let i = 0; i< activationOptions.length; i++) {
					let selected = activationOptions[i];
					if (selected.name === "Enhancement") {
						let bonus = new Bonus([BonusCategory.TO_HIT, BonusCategory.DAMAGE], BonusType.UNTPYED, +selected.value, "Weapon bonus");
						this.bonusEffectList.add(bonus);
					} else if (selected.value !== true) {
						continue;
					}
					if (selected.other === undefined) {
						continue;
					}
					if (selected.other instanceof Bonus) {
						this.bonusEffectList.add(selected.other);
					}
					else if (selected.other.bonus instanceof Bonus) {
						this.bonusEffectList.add(selected.other.bonus);
						if (selected.other.cost !== undefined) {
							poolCost += selected.other.cost;
						}
					}
					
				}
				this.bonusEffectList.activate();
				//TODO: reduce arcane pool cost
			})
			.deactivate( function() {
				if (this.bonusEffectList !== undefined) {
					this.bonusEffectList.deactivate();
					delete this.bonusEffectList;
				}
				
			})
			.owner(owner)
			.get();
	},
		
	spellCombat : function(owner) {
		
		return getAbilityBuilder()
			.name("Spell combat")
			.actionType(ActionType.FREE)
			.activationOptions(new AbilityOption("Concentration", "range", () => {
				let intModifier = owner.attributes.intelligence.getModifier();
				return "0-"+intModifier;
			}))
			.activationOptions(new AbilityOption("Touch spell", "boolean", "off/on", "on"))
			.activate(function(concentrationOption, touchSpellOption) {
				
				if (touchSpellOption !== undefined && touchSpellOption.value === "on") {
					this.extraAttackBonus = new ExtraAttackBonus(this.name, "mainHand");
					triggerModelChange("EXTRA_ATTACK", this.extraAttackBonus);
				}
				
				let extraConcentration = 0;
				if(concentrationOption !== undefined && concentrationOption.value !== undefined)  {
					extraConcentration = +concentrationOption.value;
				}
				
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
					delete this.bonusEffectList;
				}
				if (this.extraAttackBonus !== undefined) {
					this.owner.offense.removeAttack(this.name);
					delete this.extraAttackBonus;
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
			.name("Spell recall")
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



