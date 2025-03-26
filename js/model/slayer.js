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
	sneakAttack : function(owner) {
			return getAbilityBuilder()
				.name("Sneak Attack")
				.actionType(ActionType.PASSIVE)
				.activate(function() {
					this.sneakDice = Math.floor(this.owner.level / 3);
				})
				.owner(owner)
				.get();
		},
	stealth : function(owner) {
		return getAbilityBuilder()
			.name("Stealth")
			.actionType(ActionType.FREE)
			.activationOptions(function () {
				let options = [];
				options.push(new AbilityOption("First attack only", "boolean", "[0,1]" ));
				
				if(this.ability.owner.getAbilityByName("Master Sniper") != null)
				{
					options.push(new AbilityOption("Master Sniper", "boolean", "[0,1]" ));
				}
				
				if(this.ability.owner.equipment.head.name == "Sniper Goggles")
				{
					//options.push(new AbilityOption("Within 30 ft", "boolean", "[0,1]" ))
				}
				
				return options;
				
			})
			.validateActivation(function(options) {
								
				if (options[1].name == "Master Sniper" && options[1].value == 1 && options[0].value == 1)
				{
					return false;
				}

				return true;
			})
			.activate(function(...options) {
				this.sneak = this.owner.getAbilityByName("Sneak Attack");
				if (this.sneak == null) {
					return;
				}
				
				let masterSniper = options.find(o => {o.name == "Master Sniper"});
				let feet30 =  options.find(o => {o.name == "Within 30 ft"})
				
				let sneakDice = new DiceInfo("Sneak Attack", "PRECISION", this.sneak.sneakDice+"d6");
				let allAttacks = owner.offense.getAttacks();
				let attacksToModify = 1;
				if(this.owner.getAbilityByName("Rapid Shot")) {
					attacksToModify = 2;
				}
				else if(masterSniper != null && masterSniper.value == true) {
					this.bonusEffectList = new BonusEffectList(this);
					this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -2, this.name));
					this.bonusEffectList.activate();
					
					this.extraAttackBonus = new ExtraAttackBonus(this.name, "mainHand");
					this.extraAttackBonus.attrToHit = owner.offense.attrToHit;
					triggerModelChange("EXTRA_ATTACK", this.extraAttackBonus);
				}
				if(masterSniper != null && masterSniper.value == true) {
					attacksToModify = 2;
					this.masterSniper = true;
					this.owner.offense.addAttacksLimit(2, "MASTER SNIPER");
				}
				
				if(options[0].value == false) {
					attacksToModify = allAttacks.length;
				}
				
				
				let pointBlankShot = this.owner.getAbilityByName("Point Blank Shot")
				if(this.owner.equipment.eyes.name == "Sniper Goggles")
				{
					
					if(pointBlankShot != undefined && pointBlankShot.active)
					{
						this.sniperGogglesEffects = new BonusEffectList(this.owner.equipment.eyes);
						this.sniperGogglesEffects.add(new Bonus(BonusCategory.DAMAGE, BonusType.UNTYPED, this.sneak.sneakDice*2, "Sniper Goggles"));
						this.sniperGogglesEffects.activate();
					}
					
				}
				else if(pointBlankShot == null || !pointBlankShot.active)
				{
					attacksToModify = 0;
				}
				
				for( let i = 0; i < attacksToModify; i++)
				{
					allAttacks[i].diceManager.addDice(sneakDice);
				}

			})
			.deactivate(function() {
				if(this.sneak != null) {
					triggerModelChange("DAMAGE_DICE","Sneak Attack", "REMOVED");
				}
				if(this.masterSniper)
				{
					this.owner.offense.removeAttacksLimit("MASTER SNIPER");
				}
				if(this.bonusEffectList != null)
				{
					this.bonusEffectList.deactivate();
				}
				if(this.sniperGogglesEffects != null)
				{
					this.sniperGogglesEffects.deactivate();
				}
			})
			.get();
	},	

};






