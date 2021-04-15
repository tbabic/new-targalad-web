function Defense(character) {
	
	this.character = character;
	this.maxDexBonus = 1000;
    this.character = character;
	this.armor = undefined;

	this.bonusProcessor = new BonusProcessor();
	this.touchBonusProcessor = new BonusProcessor();
	this.flatFootedBonusProcessor = new BonusProcessor();
	this.cmdBonusProcessor = new BonusProcessor();
	
	this.getArmorClass = function() {
		value = 10;
		if (this.armor !== undefined) {
			value += Math.min(this.armor.maxDexBonus, character.attributes.dexterity.getModifier());
		} else {
			value += character.attributes.dexterity.getModifier();
		}
		value += this.bonusProcessor.getValue();
		return value;
	};
	
	this.getTouchAc = function() {
		value = 10;
		if (this.armor !== undefined) {
			value += +Math.min(this.armor.maxDexBonus, character.attributes.dexterity.getModifier());
		} else {
			value += +character.attributes.dexterity.getModifier();
		}
		value += +this.touchBonusProcessor.getValue();
		return value;
	};
	
	this.getFlatFootedAc = function() {
		value = 10;
		value += +this.flatFootedBonusProcessor.getValue();
		return value;
	};
	
	this.getCmd = function() {
		value = 10;
		value += +character.attributes.strength.getModifier();
		value += +character.attributes.dexterity.getModifier();
		value += +character.getBab();
		value += +this.cmdBonusProcessor.getValue();
		return value;
	}
	
	this.removeDexBonus = function(source) {
		//remove dex and dodge bonus to AC
		var penaltyValue = Math.min(this.armor.maxDexBonus, character.attributes.dexterity.getModifier());
		penaltyValue += this.bonusProcessor.getValueByType(BonusType.DODGE);
		this.dexPenalty = new BonusEffect(source, new Bonus(BonusCategory.ARMOR_CLASS, BonusType.Penalty, -penaltyValue, "No Dex to AC"));
		this.bonusProcessor.add(this.dexPenalty.source, this.dexPenalty.bonus);
		this.touchBonusProcessor.add(this.dexPenalty.source, this.dexPenalty.bonus);
		this.cmdBonusProcessor.add(this.dexPenalty.source, this.dexPenalty.bonus);
	};
	
	this.applyDexBonus = function() {
		if (this.dexPenalty !== undefined) {
			this.bonusProcessor.remove(this.dexPenalty.source, this.dexPenalty.bonus);
			this.touchBonusProcessor.remove(this.dexPenalty.source, this.dexPenalty.bonus);
		}
	};
	
	addModelListener("ARMOR", "ADDED", (e, armor) => {
		this.armor = armor;
		this.bonusProcessor.add(armor.id, armor.armorBonus);
		this.flatFootedBonusProcessor.add(armor.id, armor.armorBonus);
	});
	
	addModelListener("ARMOR", "REMOVED", (e, armor) => {
		if(this.armor !== undefined && this.armor.id == armor.id) {
			this.armor = undefined;
		}
		this.bonusProcessor.remove(armor.id, armor.armorBonus);
		this.flatFootedBonusProcessor.remove(armor.id, armor.armorBonus);
	});
	
	addModelListener("ARMOR_CLASS", (e, bonusEffect) => {
		var bonusType = bonusEffect.bonus.type;
		this.bonusProcessor.processBonusEffect(bonusEffect);
		if([BonusType.SHIELD, BonusType.ARMOR, BonusType.NATURAL_ARMOR, BonusType.ENHANCEMENT].indexOf(bonusType) == -1) {
			this.touchBonusProcessor.processBonusEffect(bonusEffect);
			this.cmdBonusProcessor.processBonusEffect(bonusEffect);
		}
		if(bonusType != BonusType.DODGE) {
			this.flatFootedBonusProcessor.processBonusEffect(bonusEffect);
		}
		
	});
	
	addModelListener("CMD", (e, bonusEffect) => {
		var bonusType = bonusEffect.bonus.type;
		this.cmdBonusProcessor.processBonusEffect(bonusEffect);
		
	});
}



