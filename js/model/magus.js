function Magus(character) {
	this.character = character;
	this.arcanas = [];
	this.classAbilities = [];
	
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
	
	if (character.level >= 3) {
		this.arcanas.push(MagusArcanaFactory.arcaneAccuracy(character));
	}
	
	if (character.level >= 6) {
		this.arcanas.push(MagusArcanaFactory.empoweredMagic(character));
		this.arcanas.push(MagusArcanaFactory.songOfTheBladeDance(character));
	}
	
	this.addArcana = function(arcana) {
		this.arcanas.push(arcana);
	};
	
	this.getArcanePool = function() {
		return this.character.attributes.intelligence.getModifier() + Math.floor(this.character.level/2);
	};
	
	this.getAllAbilities = function() {
		return this.arcanas.concat(this.classAbilities);
	};
	
	
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
	}
	
};


var MagusAbilities = {
	spellCombat : function(owner) {
		
		return new Ability("Spell combat", ActionType.FREE, owner, [], function(extraConcentration) {
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
