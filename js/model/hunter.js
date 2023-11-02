function Hunter(character) {
	this.character = character;
	this.classAbilities = [];
	this.spellbook = new SpellBook(this.character, 210, 3);
	this.memorizedSpells = new MemorizedSpells(this.character);
	
	this.character.animalCompanion = "whirlwind"
	
	this.getBab = function(level) {
		return Math.floor(level * 0.75);
	};
	
	
	this.saves = new Saves(true, true, false,  this.character);
	
	
	if (character.level >= 1) {
		this.classAbilities.push(HunterAbilities.animalFocus(this.character));
	}
	
	
	this.getAllAbilities = function() {
		return this.classAbilities;
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

	
	
};

var HunterAbilities = {
		
	animalFocus : function(owner) {
		return getAbilityBuilder()
			.name("Animal Focus")
			.actionType(ActionType.SWIFT)
			.activationOptions(function () {
				
				let options = [];
				options.push(new AbilityOption("Bull (Str)", "boolean", "[0,1]" ));
				options.push(new AbilityOption("Bear (Con)", "boolean", "[0,1]" ));
				options.push(new AbilityOption("Tiger (Dex)", "boolean", "[0,1]" ));
				
				return options;
				
			})
			.validateActivation(function(activationOptions) {
				if (activationOptions == undefined) {
					return false;
				}
				if (!Array.isArray(activationOptions)) {
					return true;
				}
				
				let activated = 0;
				activationOptions.forEach(option => {
					if (option.value == 1) {
						activated ++;
					}
				})
				if (owner.masterLevel >= 8 || (owner.masterLevel == null && this.owner.level >= 8)) {
					return activated >= 1 && activated <= 2
				}
				
				return activated == 1;
			})
			.activate(function(...activationOptions) {
				if (activationOptions === undefined) {
					return;
				}
				let selected = [];
				activationOptions.forEach(option => {
					if (option.value == 1) {
						selected.push(option);
					}
				});
				if (selected == []) {
					return;
				}
				let bonusCategory = selected.map( s => {
					if (s.name == "Bull (Str)") {
						return "STRENGTH";
					}
					if (s.name == "Bear (Con)") {
						return "CONSTITUTION";
					}
					if (s.name == "Tiger (Dex)") {
						return  "DEXTERITY";
					}
				});
				
				
				
				
				
				this.bonusEffectList = new BonusEffectList(this);
				let bonus = new Bonus(bonusCategory, BonusType.ENHANCEMENT, 2, this.name);
				this.bonusEffectList.add(bonus);
				this.bonusEffectList.activate();
				
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
	
		
};






