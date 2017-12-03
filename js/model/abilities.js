function AbilityBuilder() {
	let abilityConstr = {};
	return {
		name : function(value) {
			abilityConstr.name = value;
			return this;
		},
		
		actionType : function(value) {
			abilityConstr.actionType = value;
			return this;
		},
		
		properties : function(value) {
			abilityConstr.properties = Utils.arrayAppend(abilityConstr.properties, value);
			return this;
		},
		
		activate : function(value) {
			abilityConstr.activateCallback = value;
			return this;
		},
		
		deactivate : function(value) {
			abilityConstr.deactivateCallback = value;
			return this;
		},
		
		owner : function(value) {
			abilityConstr.owner = value;
			return this;
		},
		
		activationOptions : function(value) {
			abilityConstr.activationOptions = Utils.arrayAppend(abilityConstr.activationOptions, value);
			return this;
		},
		
		get : function(owner) {
			if (owner !== undefined) {
				owner(owner);
			}
			return new Ability(abilityConstr);
		}
	};
}

function Ability(constr) {
	this.id = idGenerator.generate();
	this.properties = new BonusEffectList(this);
	this.activationOptions = new AbilityOptions(this);
	if(constr !== undefined) {
		this.properties.add(constr.properties);
		this.name = constr.name;
		this.actionType = constr.actionType;
		this.activateCallback = constr.activateCallback;
		this.deactivateCallback = constr.deactivateCallback;
		this.owner = constr.owner;
		this.activationOptions.add(constr.activationOptions);
	}
	this.active = false;
	
	
	
	this.activate = function(...params){
		if (this.owner === undefined) {
			return;
		}
		console.log("activating ability " + this.name);
		this.properties.activate(this);
		this.active = true;
		if (this.owner !== undefined && this.activateCallback instanceof Function) {
			this.activateCallback.apply(this, params);
		}
	};
	
	this.deactivate = function(...params){
		this.active = false;
		this.properties.deactivate(this);
		if (this.owner !== undefined && this.deactivateCallback instanceof Function) {
			console.log("deactivating ability " + this.name);		
			this.deactivateCallback.apply(this, params);
		}
	};
	
	if (this.actionType == ActionType.PASSIVE && this.owner !== undefined) {
		this.active = true;
		this.activate();		
	}
	
	this.setOwner = function(owner) {
		this.owner = owner;
		if (this.actionType == ActionType.PASSIVE && owner !== undefined) {
			this.activate();
		}
	};
	
	addModelListener("ABILITY"+this.id, "ACTIVATED", (e) => {
		this.activate();
	});
	
	addModelListener("ABILITY"+this.id, "DEACTIVATED", (e) => {
		this.deactivate();
	});	
}


function AbilityOption(name, type, possibleValues, defaultValue) {
	this.name = name;
	this.possibleValues = possibleValues;
	//valid type options
	switch (type.toLowerCase()) {
		case "string" :
		case "text" :
			this.type = "text";
			break;
		case "range" :
			this.type = "range";
			break;
		case "boolean" :
		case "check" :
		case "checkbox" :
			this.type = "checkbox";
			break;
		case "number" :
		case "int" :
		case "integer" :
			this.type = "number";
			break;
		default :
			this.type = "text";
			break;
	}
	this.value = defaultValue;
}

function AbilityOptions(ability, options) {
	this.ability = ability;
	this.options = undefined;
	
	this.add = function(options) {
		this.options = Utils.arrayAppend(this.options, options);
	};
	
	this.add(options);
	
	this.isEmpty = function() {
		if (this.options === undefined || this.options.length === 0) {
			return true;
		}
		return false;
	};
}
function getAbilityBuilder() {
	return new AbilityBuilder();
}

var AbilityFactory = {
	fightingDefensively : function(owner) {
		return getAbilityBuilder()
			.name("Fighting defensively")
			.actionType(ActionType.FREE)
			.activate(function() {
				let acBonusValue = 2;
				if ( this.owner.skillSet.getSkill(SkillsEnum.ACROBATICS).ranks >=3) {
					acBonus = 3;
				}
				this.bonusEffectList = new BonusEffectList(this, [
					new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DODGE, acBonusValue, this.name), 
					new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -4, this.name)]);
				this.bonusEffectList.activate();
			})
			.deactivate(function() {
				if (this.bonusEffectList !== undefined) {
					this.bonusEfectList.deactivate();
				}
			})
			.owner(owner)
			.get();
	},
	
	charge : function(owner) {
		return getAbilityBuilder()
			.name("Charge")
			.actionType(ActionType.STANDARD)
			.properties(new Bonus(BonusCategory.TO_HIT, BonusType.UNTYPED, 2, "Charge"))
			.properties(new Bonus(BonusCategory.ARMOR_CLASS, BonusType.PENALTY, -2, "Charge"))
			.owner(owner)
			.get();
	}

};


