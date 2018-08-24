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
		
		validateActivation : function(value) {
			abilityConstr.validateActivation = value;
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
		if (constr.validateActivation !== undefined) {
			this.activationOptions.validate = constr.validateActivation;
		}
	}
	this.active = false;
	
	this.validateActivation = function(...params) {
		return this.activationOptions.validate(...params);
	};
	
	this.activate = function(...params){
		
		let isValid = this.validateActivation(...params);
		if (!isValid) {
			return;
		}
		
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
	
	this.hasActivationOptions = function() {
		if (this.activationOptions === undefined || this.activationOptions.isEmpty()) {
			return false;
		}
		return true;
	};
	
	addModelListener("ABILITY"+this.id, "ACTIVATED", (e) => {
		this.activate();
	});
	
	addModelListener("ABILITY"+this.id, "DEACTIVATED", (e) => {
		this.deactivate();
	});	
}


function AbilityOption(name, type, possibleValues, defaultValue, other) {
	this.name = name;
	this.possibleValues = possibleValues;
	this.value = defaultValue;
	
	this.other = other;
	//valid type options
	switch (type.toLowerCase()) {
		case "string" :
		case "text" :
			this.type = "string";
			break;
		case "range" :
			this.type = "range";
			break;
		case "boolean" :
		case "check" :
		case "checkbox" :
		case "true/false":
			this.type = "boolean";
			break;
		case "number" :
		case "int" :
		case "integer" :
			this.type = "number";
			break;
		default :
			this.type = "string";
			break;
	}
	

}


function AbilityOptions(ability, options, validate) {
	this.ability = ability;
	this.options = options;
	this.validate = validate;
	if (this.validate === undefined) {
		this.validate = function() {
			return true;
		};
	}
	
	
	this.add = function(options) {
		if (options instanceof AbilityOptions) {
			options = options.options;
		}
		this.options = Utils.arrayAppend(this.options, options);
	};
	
	this.add(options);
	
	this.isEmpty = function() {
		if (this.options === undefined || this.options.length === 0) {
			return true;
		}
		return false;
	};
	
	this.getOptions = function() {
		let options = [];
		for (let i = 0; i < this.options.length; i++) {
			if (Utils.isFunction(this.options[i])) {
				this.optionsFunc = this.options[i];
				Utils.arrayAppend(options, this.optionsFunc());
			} else {
				Utils.arrayAppend(options, this.options[i]);
			}
		}
		return options;
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
					acBonusValue = 3;
				}
				this.bonusEffectList = new BonusEffectList(this, [
					new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DODGE, acBonusValue, this.name), 
					new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -4, this.name)]);
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


