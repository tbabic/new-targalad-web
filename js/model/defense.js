function Defense(character) {
	
	this.character = character;
	this.maxDexBonus = 1000;
    this.character = character;
	this.armor = undefined;

	this.bonusProcessor = new BonusProcessor();
	this.touchBonusProcessor = new BonusProcessor();
	this.flatFootedBonusProcessor = new BonusProcessor();
	
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
			value += Math.min(this.armor.maxDexBonus, character.attributes.dexterity.getModifier());
		} else {
			value += character.attributes.dexterity.getModifier();
		}
		value += this.touchBonusProcessor.getValue();
		return value;
	};
	
	this.getFlatFootedAc = function() {
		value = 10;
		value += this.flatFootedBonusProcessor.getValue();
		return value;
	};
	
	addModelListener("ARMOR", "ADDED", (e, armor) => {
		this.armor = armor;
		this.bonusProcessor.add(armor.id, armor.armorBonus);
		this.flatFootedBonusProcessor.add(armor.id, armor.armorBonus);
		triggerViewChange("DEFENSE", this);
	});
	
	addModelListener("ARMOR", "REMOVED", (e, armor) => {
		if(this.armor !== undefined && this.armor.id == armor.id) {
			this.armor = undefined;
		}
		this.bonusProcessor.remove(armor.id, armor.armorBonus);
		this.flatFootedBonusProcessor.remove(armor.id, armor.armorBonus);
		triggerViewChange("DEFENSE", this);
	});
	
	addModelListener("ARMOR_CLASS", (e, bonusEffect) => {
		var bonusType = bonusEffect.bonus.type;
		this.bonusProcessor.processBonusEffect(bonusEffect);
		if([BonusType.SHIELD, BonusType.ARMOR, BonusType.NATURAL_ARMOR].indexOf(bonusType) == -1) {
			this.touchBonusProcessor.processBonusEffect(bonusEffect);
		}
		if(bonusType != BonusType.DODGE) {
			this.flatFootedBonusProcessor.processBonusEffect(bonusEffect);
		}
		triggerViewChange("DEFENSE", this);
		
	});
}



