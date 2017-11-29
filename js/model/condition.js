function Condition(name, bonusProperties, activate, deactivate) {
	this.name = name;
	this.properties = new BonusEffectList(this, bonusProperties);
	this.activate = activate;
	this.deactivate = deactivate;
	
	this.apply = function(character) {
		character.addCondition(this);
		this.properties.activate();
		if (this.activate !== undefined) {
			this.activate(character);
		}
	};
	this.remove = function(character) {
		character.removeCondition(this);
		this.properties.deactivate();
		if (this.deactivate !== undefined) {
			this.deactivate(character);
		}
	};
	
}


ConditionsFactory = {
		blinded: new Condition("blinded", [new Bonus(BonusCategory.ARMOR_CLASS, BonusType.PENALTY, -2, "blinded")], 
			function(character) {
				//remove dexBonus and dodge bonus to AC
				character.defense.removeDexBonus(this.name);
				//TODO -4 penalty to dex and str skill checks and perception
			}, 
			function(character) {
				character.defense.applyDexBonus();
			}
		),
		
		confused: new Condition("confused", []),
		cowering: new Condition("cowering", []),
		dazed: new Condition("dazed", []),
		dazzled: new Condition("dazzled", []),
		entangled: new Condition("entangled", []),
		exhausted: new Condition("exhausted", []),
		fascinated: new Condition("fascinated", []),
		fatigued: new Condition("fatigued", []),
		flatfooted: new Condition("flatfooted", []),
		frightened: new Condition("frightened", []),
		grappled: new Condition("grappled", []),
		invisible: new Condition("invisible", []),
		nauseated: new Condition("nauseated", []),
		panicked: new Condition("panicked", []),
		paralyzed: new Condition("paralyzed", []),
		petrified: new Condition("petrified", []),
		pinned: new Condition("pinned", []),
		prone: new Condition("prone", []),
		shaken: new Condition("shaken", []),
		sickened: new Condition("sickened", []),
		staggered: new Condition("staggered", []),
		stunned: new Condition("stunned", [])
};



