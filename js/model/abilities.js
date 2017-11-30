function Ability(name, actionType, owner, propertiesOrActivate, activateOrDeactivate, deactivate) {
	this.name = name;
	this.id = idGenerator.generate();
	this.actionType = actionType;
	this.activateCallback = undefined;
	this.deactivateCallback = undefined;
	this.owner = owner;
	this.active = false;
	this.properties = new BonusEffectList(this);
	if (propertiesOrActivate instanceof Function) {
		this.activateCallback = propertiesOrActivate;
		this.deactivateCallback = activateOrDeactivate;
	} else {
		if(propertiesOrActivate !== undefined) {
			this.properties.add(propertiesOrActivate);
		}
		this.activateCallback = activateOrDeactivate;
		this.deactivateCallback = deactivate;
	}
	
	
	this.activate = function(){
		if (this.owner === undefined) {
			return;
		}
		if (actionType != ActionType.FREE && actionType != ActionType.PASSIVE) {
			owner.deactivateAbilitiesByAction(actionType);
		}
		
		console.log("activating ability " + this.name);
		this.properties.activate(this);
		if (this.owner !== undefined && this.activateCallback instanceof Function) {
			this.activateCallback(this.owner);
		}
	};
	
	this.deactivate = function(){
		this.properties.deactivate(this);
		if (this.owner !== undefined && this.deactivateCallback instanceof Function) {
			console.log("deactivating ability " + this.name);		
			this.deactivateCallback(this.owner);
		}
	};
	
	if (actionType == ActionType.PASSIVE && owner !== undefined) {
		this.active = true;
		this.activate();		
	}
	
	this.setOwner = function(owner) {
		this.owner = owner;
		if (actionType == ActionType.PASSIVE && owner !== undefined) {
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


var AbilityFactory = {
	fightingDefensively : function(owner) {
		return new Ability("Fighting defensively", ActionType.FREE, owner, [
			new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DODGE, 3, "Fighting defensively"),
			new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -4, "Fighting defensively")]);
	},
	
	
//	totalDefense : function(owner) {
//		return new Ability("Total defense", ActionType.STANDARD, owner, 
//			new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DODGE, 6, "Total defense"));
//	},
	charge : function(owner) {
		return new Ability("Charge", ActionType.STANDARD, owner, [
			new Bonus(BonusCategory.TO_HIT, BonusType.UNTYPED, 2, "Charge"),
			new Bonus(BonusCategory.ARMOR_CLASS, BonusType.PENALTY, -2, "Charge")]);
	}
};

var AbilityPrerequisiteEnum = {
	"BAB" : "BAB",
	"LEVEL" : "LEVEL",
	"CLASS_LEVEL" : "CLASS_LEVEL",
	"CASTER_LEVEL" : "CASTER_LEVEL",
	
};


var AbilityPrerequisite = {
	
};

