function Slayer(character) {
	this.character = character;
	this.classAbilities = [];
	this.saves = new Saves(true, true, false,  this.character);
	
	this.getBab = function(level) {
		return Math.floor(level * 1);
	};
	
	
	
	
	
	if (character.level >= 1) {
		this.classAbilities.push(SlayerAbilities.study(character));
	}
	
	this.getAllAbilities = function() {
		return this.classAbilities;
	};
	
	this.classSkills = [SkillsEnum.CLIMB, SkillsEnum.CRAFT_ALCHEMY, SkillsEnum.CRAFT_ARMOR, SkillsEnum.CRAFT_WEAPON, 
		SkillsEnum.FLY, SkillsEnum.INTIMIDATE, 
		SkillsEnum.KNOWLEDGE_ARCANA, SkillsEnum.KNOWLEDGE_DUNGEONEERING, SkillsEnum.KNOWLEDGE_PLANES, 
		SkillsEnum.PROFESSION, SkillsEnum.RIDE, SkillsEnum.SPELLCRAFT, SkillsEnum.SWIM, SkillsEnum.USE_MAGIC_DEVICE];
	
};

var SlayerAbilities = {
		
	study : function(owner) {
			return getAbilityBuilder()
				.name("Studied Target")
				.actionType(ActionType.SWIFT)
				.activate(function() {
					let bonusValue = 1;
					bonusValue += Math.floor(this.owner.level / 5);
					this.bonusEffectList = new BonusEffectList(this, new Bonus("TO_HIT", BonusType.UNTYPED, bonusValue, this.name));
					
					this.bonusEffectList.add(new Bonus("DAMAGE", BonusType.UNTYPED, bonusValue, this.name));
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






