function SlayerVampireHunter(character) {
	this.character = character;
	this.classAbilities = [];
	this.saves = new Saves(true, true, false,  this.character);
	
	this.getBab = function(level) {
		return Math.floor(level * 1);
	};
	
	
	
	
	
	if (character.level >= 1) {
		this.classAbilities.push(SlayerAbilities.study(character));
		this.classAbilities.push(SlayerAbilities.stealth(character));
	}
	
	if (character.level >= 11) {
		this.classAbilities.push(VampireHunterAbilities.vampireHunter(character));
	}
	
	if (character.level >= 3) {
		this.classAbilities.push(VampireHunterAbilities.sneakAttack(character));
	}
	
	this.getAllAbilities = function() {
		return this.classAbilities;
	};
	
	this.classSkills = [SkillsEnum.CLIMB, SkillsEnum.CRAFT_ALCHEMY, SkillsEnum.CRAFT_ARMOR, SkillsEnum.CRAFT_WEAPON, 
		SkillsEnum.FLY, SkillsEnum.INTIMIDATE, 
		SkillsEnum.KNOWLEDGE_ARCANA, SkillsEnum.KNOWLEDGE_DUNGEONEERING, SkillsEnum.KNOWLEDGE_PLANES, 
		SkillsEnum.PROFESSION, SkillsEnum.RIDE, SkillsEnum.SPELLCRAFT, SkillsEnum.SWIM, SkillsEnum.USE_MAGIC_DEVICE];
	
};

var VampireHunterAbilities = {
		
	
	vampireHunter : function(owner) {
		return getAbilityBuilder()
			.name("vampireHunter")
			.actionType(ActionType.PASSIVE)
			.activate(function() {
				this.bonusEffectList = new BonusEffectList(this);
				this.bonusEffectList.add(new Bonus('FORTITUDE', BonusType.PENALTY, -1, this.name));
				this.bonusEffectList.add(new Bonus('WILL', BonusType.UNTYPED, 2, this.name));
				this.bonusEffectList.add(new Bonus('REFLEX', BonusType.UNTYPED, 2, this.name));
				this.bonusEffectList.activate();		
							
							
							
			})
			.owner(owner)
			.get();
	},
	sneakAttack : function(owner) {
			return getAbilityBuilder()
				.name("Sneak Attack")
				.actionType(ActionType.PASSIVE)
				.activate(function() {
					this.sneakDice = Math.floor(10 / 3);
				})
				.owner(owner)
				.get();
		},
	

};






