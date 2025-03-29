function Condition(name, bonusProperties, activate, deactivate, options) {
	this.name = name;
	this.bonusProperties = bonusProperties;
	this.properties = new BonusEffectList(this, bonusProperties);
	this.activate = activate;
	this.deactivate = deactivate;
	this.options = options;
	
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

function ConditionOption(name, defaultValue, other) {
	this.name = name;
	this.defaultValue = defaultValue;
	this.value = defaultValue;
	this.other = other;
}



function ConditionEffect(character, condition) {
	//this.id = idGenerator.generate();
	this.character = character;
	Condition.call(this, condition.name, condition.bonusProperties, condition.activate, condition.deactivate, condition.options); 
	
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
					existingCondition.bonusEffectList.deactivate();
				}
				
				let drain = this.options[0].value;
				this.bonusEffectList = new BonusEffectList(this);
				this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -drain, this.name));
				this.bonusEffectList.add(new Bonus(BonusCategory.SAVES, BonusType.PENALTY, -drain, this.name));
				this.bonusEffectList.add(new Bonus(BonusCategory.SKILLS, BonusType.PENALTY, -drain, this.name));
				this.bonusEffectList.activate();
			},
			function(character) {
				this.bonusEffectList.deactivate();
			},
			[new ConditionOption("Levels", 1)]
			
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
		abilityPenalties : new Condition("Ability Penalties", [], 
			function(character) {
				let existingCondition = character.getCondition(this.name);
				if (existingCondition !== undefined) {
					existingCondition.bonusEffectList.deactivate();
				}
				
				
				this.bonusEffectList = new BonusEffectList(this);
				
				for(let i = 0; i < this.options.length; i++)
				{
					let attrDamage = this.options[i].value;
					let attribute = this.options[i].other;
					if(attrDamage > 0)
					{
						this.bonusEffectList.add(new Bonus(attribute, BonusType.PENALTY, -attrDamage, this.name));
					}
					
				}
				
				this.bonusEffectList.activate();
			},
			function(character) {
				this.bonusEffectList.deactivate();
			},
			[
				new ConditionOption("Str", 0, "STRENGTH"),
				new ConditionOption("Dex", 0, "DEXTERITY"),
				new ConditionOption("Con", 0, "CONSTITUTION"),
				new ConditionOption("Int", 0, "INTELLIGENCE"),
				new ConditionOption("Wis", 0, "WISDOM"),
				new ConditionOption("Cha", 0, "CHARISMA"),
			]
		),
		otherPenalties : new Condition("Other Penalties", [], 
			function(character) {
				let existingCondition = character.getCondition(this.name);
				if (existingCondition !== undefined) {
					existingCondition.bonusEffectList.deactivate();
				}
				
				
				this.bonusEffectList = new BonusEffectList(this);
				
				for(let i = 0; i < this.options.length; i++)
				{
					let penaltyValue = this.options[i].value;
					let penaltyName = this.options[i].other;
					if(penaltyValue > 0)
					{
						this.bonusEffectList.add(new Bonus(penaltyName, BonusType.PENALTY, -penaltyValue, this.name));
					}
				}
				
				this.bonusEffectList.activate();
			},
			function(character) {
				this.bonusEffectList.deactivate();
			},
			[
				new ConditionOption("To hit", 0, "TO_HIT"),
				new ConditionOption("Dmg", 0, "DAMAGE"),
				new ConditionOption("AC", 0, "ARMOR_CLASS"),
				new ConditionOption("Fort", 0, "FORTITUDE"),
				new ConditionOption("Ref", 0, "REFLEX"),
				new ConditionOption("Will", 0, "WILL"),
			]
		),
		
};

var allConditions = [];
for (let prop in ConditionsFactory ) {
	allConditions.push(ConditionsFactory[prop]);
}

var ConditionStorage = {
	
	add : function(condition){
		let list = this.get();
		let index = list.findIndex( el => el.name == condition.name);
		if(index == -1)
		{
			list.push(
				{
					name: condition.name,
					options: condition.options
				});
		}
		else
		{
			list[index] = {
					name: condition.name,
					options: condition.options
				};
		}
		let newStoreString = JSON.stringify(list);
		window.localStorage.setItem(this.getStoringId(), newStoreString);
	},
	remove : function(condition)
	{
		let list = this.get();
		let index = list.findIndex( el => el.name == condition.name);
		if(index >= 0)
		{
			list.splice(index, 1);
		}
		
		let newStoreString = JSON.stringify(list);
		window.localStorage.setItem(this.getStoringId(), newStoreString);
	},
	
	get : function()
	{
		let storeString = window.localStorage.getItem(this.getStoringId());
		let list = [];
		if (storeString != null) {
			list = JSON.parse(storeString);
		}
		return list;
	},
	
	getStoringId : function() {
		return "conditions"+window.location.pathname;
	},
}


