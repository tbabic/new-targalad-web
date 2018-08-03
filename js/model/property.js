BonusType = {
	ALCHEMICAL : "ALCHEMICAL",
	ARMOR : "ARMOR",
	CIRCUMSTANCE : "CIRCUMSTANCE",
	COMPETENCE : "COMPETENCE",
	DEFLECTION : "DEFLECTION",
	DODGE : "DODGE",
	ENHANCEMENT : "ENHANCEMENT",
	INHERENT : "INHERENT",
	INSIGHT : "INSIGHT",
	LUCK : "LUCK",
	MORALE : "MORALE",
	NATURAL_ARMOR : "NATURAL_ARMOR",
	PROFANE : "PROFANE",
	RACIAL : "RACIAL",
	RESISTANCE : "RESISTANCE",
	SACRED : "SACRED",
	SHIELD : "SHIELD",
	SIZE : "SIZE",
	TRAIT : "TRAIT",
	PENALTY : "PENALTY",
	UNTYPED : "",
	
	listAll : function() {
		var _list = [];
		for (var i in this) {
			_list.push(this[i]);
		}
		return _list;
	}
};

BonusCategory = {
	ARMOR_CLASS : "ARMOR_CLASS",
	SKILL : "SKILL",
	SAVES : "SAVES",
	TO_HIT : "TO_HIT",
	EXTRA_ATTACK: "EXTRA_ATTACK",
	DAMAGE: "DAMAGE",
	CMB : "CMB",
	CMD : "CMD",
	ATTRIBUTE: "ATTRIBUTE",
	MOVEMENT: "MOVEMENT"
	
};



function BonusProperty(categories, type, value, name) {
	this.categories = (categories.isArray) ? categories : [categories];
	this.type = type;
	this.value = value;
	this.name = name;
	this.isStacking = false;
	if (this.type == BonusType.UNTYPED || type == BonusType.DODGE || this.type == BonusType.PENALTY) {
		this.isStacking = true;
	}
	
	this.toBonusEffect = function(source){
		return new BonusEffect(source, this);
	};
	
	
	this.activate = function(source) {
		this.toBonusEffect(source).activate();
	};
	
	this.deactivate = function(source) {
		this.toBonusEffect(source).deactivate();
	};	
}

function BonusProperties(properties) {
	var _list = [];
	
	_add = function(properties) {
		if (properties === undefined) {
			return;
		}
		var propertyList = (properties.isArray) ? properties : [properties];
		for (var i = 0; i < propertyList.length; i++) {
			if (propertyList[i] instanceof BonusProperty) {
				_list.push(propertyList[i]);
			}
		}
	};
	
	_add(properties);
	
	_apply = function(source, callback) {
		for (var i = 0; i < _list.length; i++) {
			var element = _list[i];
			if (isFunction(element[callback])) {
				element[callback](source);
			}
		}
	};
	
	return {
		activate : function(source) {
			_apply(source, "activate");
		},
		
		deactivate : function(source) {
			_apply(source, "deactivate");
		},	
		
		add : _add
	};
	
	
}

function createBonus(bonusName, bonusType, categories, initValue) {
	var bonus = new BonusProperty(categories, bonusType, initValue, bonusName);
	return bonus;
}

function BonusEffect(source, bonus) {
	this.source = source;
	this.bonus = bonus;
	this.isActive = undefined;
	
	this.activate = function() {
		this.isActive = true;
		console.log("activated");
		this.apply();
	};
	
	this.deactivate = function() {
		this.isActive = false;
		console.log("deactivated");
		this.apply();
	};
	
	this.apply = function() {
		for (var i = 0; i< bonus.categories.length; i++) {
			var category = bonus.categories[i];
			triggerModelChange(category, this);
		}
	};
}


function BonusByTypeList(bonus) {
	this.categories = bonus.categories;
	this.type = bonus.type;
	this.isStacking = bonus.isStacking;
	this.sourceList = {};
	this.cachedValue = undefined;
	
	this.add = function(source, bonusValue) {
		this.remove(source);
		this.sourceList[source] = bonusValue;
		this.cachedValue = undefined;
	};
	
	this.remove = function(source) {
		if(this.sourceList.hasOwnProperty(source)) {
			delete sourceList[source];
		}
		this.cachedValue = undefined;
	};
	
	this.get = function() {
		if (cachedValue) {
			return cachedValue;
		}
		var max = 0;
		var sum = 0;
		for (var source in sourceList) {
			var current = sourceList[source];
			if (current > max) {
				current = max;
			}
			sum += current;
		}
		if (isStacking) {
			cachedValue = sum;
		} else {
			cachedValue = max;
		}
		return cachedValue;
	};
	
	this.toBonusEffect = function(source) {
		return new BonusEffect(source, this);
	};
}



function BonusList() {
	var _list = {};
	var cachedValue;
	
	return {
		add : function(source, bonus) {
			if (!(bonus instanceof Bonus)) {
				throw (bonus + " is not a bonus");
			}
			if (!_list.hasOwnProperty(bonus.type)) {
				_list[bonus.type] = new BonusByTypeList(bonus);
			}
			_list[bonus.type].add(source, bonus.value);
			
			cachedValue = undefined;
		},
		
		remove : function(source, bonus) {
			if (!(bonus instanceof Bonus)) {
				throw (bonus + " is not a bonus");
			}
			if (_list.hasOwnProperty(bonus.type)) {
				_list[bonus.type].remove(source);
			}
			cachedValue = undefined;
		},
		
		getValue : function() {
			if (cachedValue) {
				return cachedValue;
			}
			var value = 0;
			for (var i in _list) {
				value += _list[i].get();
			}
			cachedValue = value;
			return value;
		},
		
		processBonusEffect : function(bonusEffect) {
			if (!(bonusEffect instanceof BonusEffect)) {
				throw (bonus + " is not a BonusEffect");
			}
			if (bonusEffect.isActive) {
				this.add(bonusEffect.source.id, bonusEffect.bonus);
			} else {
				this.remove(bonusEffect.source.id, bonusEffect.bonus);
			}
		}
		
	};
}
