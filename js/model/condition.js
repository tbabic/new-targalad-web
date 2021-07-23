function Condition(name, bonusProperties, activate, deactivate) {
	this.name = name;
	this.bonusProperties = bonusProperties;
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
		
	};
	
	this.remove = function() {
		
		this.properties.deactivate();
		if (this.deactivate !== undefined) {
			this.deactivate(character);
		}
		this.character.removeCondition(this);
	};
}


ConditionUtils = {
		addAttributeDamage : function(character, condition, attribute, value) {
			let existingCondition = character.getCondition(condition.name);
			if (existingCondition !== undefined) {
				condition.attrDamage = existingCondition.attrDamage;
				condition.bonusEffectList.deactivate();
			} else {
				condition.attrDamage = 0;
			}
			condition.attrDamage += value;
			condition.bonusEffectList = new BonusEffectList(condition, new Bonus(attribute, BonusType.PENALTY, -condition.attrDamage));
			condition.bonusEffectList.activate();
		},

		removeAttributeDamage : function(condition) {
			condition.bonusEffectList.deactivate();
		}
}

ConditionsFactory = {
		blinded: new Condition("Blinded", 
			[new Bonus(BonusCategory.ARMOR_CLASS, BonusType.PENALTY, -2, "Blinded")], 
			function(character) {
				//remove dexBonus and dodge bonus to AC
				character.defense.removeDexBonus(this.name + "  dex penalty");
				//TODO -4 penalty to dex and str skill checks and perception
			}, 
			function(character) {
				character.defense.applyDexBonus();
			}
		),
		
		confused: new Condition("Confused", []),
		cowering: new Condition("Cowering", []),
		dazed: new Condition("Dazed", []),
		dazzled: new Condition("Dazzled", 
			[new Bonus([BonusCategory.TO_HIT, SkillsEnum.PERCEPTION], BonusType.PENALTY, -1, "Dazzled")]),
		drained: new Condition("Drained", [], 
			function(character) {
				let existingCondition = character.getCondition(this.name);
				if (existingCondition !== undefined) {
					this.drained = existingCondition.drained;
					existingCondition.bonusEffectList.deactivate();
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
		entangled: new Condition("Entangled", 
			[new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -2, "Entangled"), new Bonus('DEXTERITY', BonusType.PENALTY, -4, "Entangled")]),
		exhausted: new Condition("Exhausted", 
			[new Bonus(['DEXTERITY', 'STRENGTH'], BonusType.PENALTY, -6, "Exhausted")]),
		fascinated: new Condition("Fascinated", []),
		fatigued: new Condition("Fatigued", 
			[new Bonus(['DEXTERITY', 'STRENGTH'], BonusType.PENALTY, -2, "Fatigued")]),
		flatfooted: new Condition("Flatfooted", []),
		frightened: new Condition("Frightened", 
			[new Bonus([BonusCategory.TO_HIT, BonusCategory.SAVES, BonusCategory.SKILLS], BonusType.PENALTY, -2, "Frightened")]),
		grappled: new Condition("Grappled", 
			[new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -2, "Grappled"), new Bonus('DEXTERITY', BonusType.PENALTY, -4, "Grappled")]),
		invisible: new Condition("Invisible", []),
		nauseated: new Condition("Nauseated", []),
		panicked: new Condition("Panicked", []),
		paralyzed: new Condition("Paralyzed", []),
		petrified: new Condition("Petrified", []),
		pinned: new Condition("Pinned", []),
		prone: new Condition("Prone",
			[new Bonus([BonusCategory.TO_HIT, BonusCategory.ARMOR_CLASS], BonusType.PENALTY, -4, "Prone")]),
		shaken: new Condition("Shaken", 
			[new Bonus([BonusCategory.TO_HIT, BonusCategory.SAVES, BonusCategory.SKILLS], BonusType.PENALTY, -2, "Shaken")]),
		sickened: new Condition("Sickened", 
			[new Bonus([BonusCategory.TO_HIT, BonusCategory.DAMAGE, BonusCategory.SAVES, BonusCategory.SKILLS], BonusType.PENALTY, -2, "Sickened")]),
		staggered: new Condition("Staggered", []),
		stunned: new Condition("Stunned", []),
		strengthPenalty : new Condition("Str Penalty", [], 
			function(character) {
				ConditionUtils.addAttributeDamage(character, this, "STRENGTH", 1)
			},
			function(character) {
				ConditionUtils.removeAttributeDamage(this);
			}),
		dexterityPenalty : new Condition("Dex Penalty", [], 
			function(character) {
				ConditionUtils.addAttributeDamage(character, this, "DEXTERITY", 1)
			},
			function(character) {
				ConditionUtils.removeAttributeDamage(this);
			}),
		constitutionPenalty : new Condition("Con Penalty", [], 
			function(character) {
				ConditionUtils.addAttributeDamage(character, this, "CONSTITUTION", 1)
			},
			function(character) {
				ConditionUtils.removeAttributeDamage(this);
			}),
		intelligencePenalty : new Condition("Int Penalty", [], 
			function(character) {
				ConditionUtils.addAttributeDamage(character, this, "INTELLIGENCE", 1)
			},
			function(character) {
				ConditionUtils.removeAttributeDamage(this);
			}),
		wisdomPenalty : new Condition("Wis Penalty", [], 
			function(character) {
				ConditionUtils.addAttributeDamage(character, this, "WISDOM", 1)
			},
			function(character) {
				ConditionUtils.removeAttributeDamage(this);
			}),
		charismaPenalty : new Condition("Cha Penalty", [], 
			function(character) {
				ConditionUtils.addAttributeDamage(character, this, "CHARISMA", 1)
			},
			function(character) {
				ConditionUtils.removeAttributeDamage(this);
			})
};

var allConditions = [];
for (let prop in ConditionsFactory ) {
	allConditions.push(ConditionsFactory[prop]);
}


