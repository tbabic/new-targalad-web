function Bloodrager(character) {
	this.character = character;
	this.classAbilities = [];
	this.spellbook = new SpellBook(this.character, 210, 3);
	this.memorizedSpells = new MemorizedSpells(this.character);
	this.saves = new Saves(true, false, false, this.character);
	
	
	this.getBab = function(level) {
		return level;
	};
	
	if (character.level >= 1) {
		this.classAbilities.push(BloodragerAbilities.bloodrage(character));
	}
	
	this.getAllAbilities = function() {
		return this.classAbilities;
	};
	
	this.classSkills = [SkillsEnum.ACROBATICS, SkillsEnum.CLIMB, SkillsEnum.CRAFT_ALCHEMY, SkillsEnum.CRAFT_ARMOR, SkillsEnum.CRAFT_WEAPON, 
		SkillsEnum.HANDLE_ANIMAL, SkillsEnum.INTIMIDATE, 
		SkillsEnum.KNOWLEDGE_ARCANA, SkillsEnum.PERCEPTION, SkillsEnum.PROFESSION, 
		SkillsEnum.RIDE, SkillsEnum.SPELLCRAFT, SkillsEnum.SWIM, SkillsEnum.SURVIVAL];
	
	this.spellsPerDay = function(spellLevel) {
		if (spellLevel > 4) {
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
		return 4;
	}
	
	this.baseSpellsPerDay = function(spellLevel) {
		if (this.character.level < startingLevel) {
			return undefined;
		}
		if (this.character.level < 4) {
			return 0;
		}
		if (spellLevel == 1) {
			if (this.characte.level < 9) {
				return 1;
			}
			if (this.characte.level < 13) {
				return 2;
			}
			if (this.characte.level < 17) {
				return 3;
			}
			return 4;
		}
		
		if (spellLevel == 2) {
			if (this.characte.level < 7) {
				return 0;
			}
			
			if (this.characte.level < 12) {
				return 1;
			}
			if (this.characte.level < 16) {
				return 2;
			}
			if (this.characte.level < 20) {
				return 3;
			}
			return 4;
		}
		
		if (spellLevel == 3) {
			if (this.characte.level < 10) {
				return 0;
			}
			
			if (this.characte.level < 15) {
				return 1;
			}
			if (this.characte.level < 19) {
				return 2;
			}
			return 3;
		}
		if (spellLevel == 4) {
			if (this.characte.level < 13) {
				return 0;
			}
			
			if (this.characte.level < 18) {
				return 1;
			}
			return 2;
		}
		return 0;
	};
	

	
	this.bonusSpellsPerDay = function(spellLevel) {
		if (spellLevel === 0) {
			return 0;
		}
		let modifier = this.character.attributes.charisma.getModifier();
		let startingModifier = modifier - spellLevel + 1;
		return Math.ceil(startingModifier/4);
	};
		
};

var BloodragerAbilities = {
		bloodrage : function(owner) {
			return getAbilityBuilder()
				.name("Bloodrage")
				.actionType(ActionType.FREE)
				.activate(function() {
					let bonusValue = 2;
					let conBonus = 2*bonusValue;
					if (this.owner.level >= 11) {
						bonusValue = 3;
					}
					this.bonusEffectList = new BonusEffectList(this, new Bonus("STRENGTH", BonusType.MORALE, 2*bonusValue, this.name));
					if (this.owner.getAbilityByName("Raging Vitality") != undefined) {
						conBonus+=2;
					}
					
					
					this.bonusEffectList.add(new Bonus("CONSTITUTION", BonusType.MORALE, conBonus, this.name));
					this.bonusEffectList.add(new Bonus('WILL', BonusType.MORALE, bonusValue, this.name));
					this.bonusEffectList.add(new Bonus(BonusCategory.ARMOR_CLASS, BonusType.PENALTY, -2, this.name));
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
};

var BloodragePowerFactory = {
		destinedStrike : function(owner) {
			return getAbilityBuilder()
				.name("Destined Strike")
				.actionType(ActionType.FREE)
				.activate(function() {
					let bloodrage = owner.getAbilityByName("Bloodrage");
					if (!bloodrage.active) {
						this.active = false;
						return;
					}
					let bonusValue = Math.floor(this.owner.level / 2);
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
		
		fatedBloodrager : function(owner) {
			return getAbilityBuilder()
				.name("Fated Bloodrager")
				.actionType(ActionType.PASSIVE)
				.activate(function() {
					let bloodrage = owner.getAbilityByName("Bloodrage");
					let bonusValue = Math.floor(this.owner.level / 4);
					if (owner.getAbilityByName("Fate's Favored") != undefined) {
						bonusValue++;
					}
					bloodrage.properties.add(new Bonus([BonusCategory.ARMOR_CLASS, BonusCategory.SAVES],  BonusType.LUCK, bonusValue, this.name));
				})
				.owner(owner)
				.get();
		},
		
		guardedStance : function(owner) {
			return getAbilityBuilder()
				.name("Guarded Stance")
				.actionType(ActionType.MOVE)
				.activate(function() {
					let bloodrage = owner.getAbilityByName("Bloodrage");
					if (!bloodrage.active) {
						this.active = false;
						return false;
					}
					let bonusValue = 1 + Math.floor(this.owner.level / 6);
					this.bonusEffectList = new BonusEffectList(this, new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DODGE, bonusValue, this.name));
					this.bonusEffectList.activate();
					
				})
				.deactivate(function() {
					if (this.bonusEffectList !== undefined) {
						this.bonusEffectList.deactivate();
					}
				})
				.owner(owner)
				.get();
		}
};


