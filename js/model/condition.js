function Condition(name, bonusProperties, activate, deactivate) {
	this.name = name;
	this.properties = new BonusEffectList(this, bonusProperties);
	this.activate = activate;
	this.deactivate = deactivate;
	
	this.apply = function(character) {
		let conditionEffect = new ConditionEffect(character, this);
		conditionEffect.apply();
		return conditionEffect;
		
		
	};
	this.remove = function(character) {
		let conditionEffect = character.getCondition(this.name);
		conditionEffect.remove();
		
		
	};
	
}

function ConditionEffect(character, condition) {
	//this.id = idGenerator.generate();
	this.character = character;
	Condition.call(this, condition.name, condition.bonusProperties, condition.activate, condition.deactivate); 
	
	this.apply = function() {
		
		this.properties.activate();
		if (this.activate !== undefined) {
			this.activate(this.character);
		}
		this.character.addCondition(this);
		
	}
	
	this.remove = function() {
		
		this.properties.deactivate();
		if (this.deactivate !== undefined) {
			this.deactivate(character);
		}
		this.character.removeCondition(this);
	}
}


ConditionsFactory = {
		blinded: new Condition("Blinded", [new Bonus(BonusCategory.ARMOR_CLASS, BonusType.PENALTY, -2, "Blinded")], 
			function(character) {
				//remove dexBonus and dodge bonus to AC
				character.defense.removeDexBonus(this.name);
				//TODO -4 penalty to dex and str skill checks and perception
			}, 
			function(character) {
				character.defense.applyDexBonus();
			}
		),
		
		confused: new Condition("Confused", []),
		cowering: new Condition("Cowering", []),
		dazed: new Condition("Dazed", []),
		dazzled: new Condition("Dazzled", []),
		drained: new Condition("Drained", [], 
			function(character) {
				let existingCondition = character.getCondition(this.name);
				if (existingCondition !== undefined) {
					this.drained = existingCondition.drained;
				} else {
					this.drained = 0;
				}
				
				this.drained++;
				this.bonusEffectList = new BonusEffectList(this);
				this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -this.drained, this.name));
				this.bonusEffectList.add(new Bonus(BonusCategory.SAVES, BonusType.PENALTY, -this.drained, this.name));
				this.bonusEffectList.add(new Bonus(BonusCategory.SKILLS, BonusType.PENALTY, -this.drained, this.name));
				this.bonusEffectList.activate();
			},
			function(character) {
				this.bonusEffectList.deactivate();
			}
		),
		entangled: new Condition("Entangled", []),
		exhausted: new Condition("Exhausted", []),
		fascinated: new Condition("Fascinated", []),
		fatigued: new Condition("Fatigued", []),
		flatfooted: new Condition("Flatfooted", []),
		frightened: new Condition("Frightened", []),
		grappled: new Condition("Grappled", []),
		invisible: new Condition("Invisible", []),
		nauseated: new Condition("Nauseated", []),
		panicked: new Condition("Panicked", []),
		paralyzed: new Condition("Paralyzed", []),
		petrified: new Condition("Petrified", []),
		pinned: new Condition("Pinned", []),
		prone: new Condition("Prone", []),
		shaken: new Condition("Shaken", []),
		sickened: new Condition("Sickened", []),
		staggered: new Condition("Staggered", []),
		stunned: new Condition("Stunned", [])
};



