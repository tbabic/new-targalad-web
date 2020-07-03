BonusType = {
	ALCHEMICAL : "ALCHEMICAL",
	ARMOR : "ARMOR",
	BAB : "BAB",
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
	UNTYPED : "UNTYPED",
	
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
	SKILLS : "SKILLS",
	SAVES : "SAVES",
	TO_HIT : "TO_HIT",
	EXTRA_ATTACK: "EXTRA_ATTACK",
	DAMAGE: "DAMAGE",
	CMB : "CMB",
	CMD : "CMD",
	ATTRIBUTE: "ATTRIBUTE",
	MOVEMENT: "MOVEMENT",
	INITIATIVE : "INITIATIVE",
	CONCENTRATION : "CONCENTRATION",
	DEFENSIVE_CASTING : "DEFENSIVE_CASTING"
	
};



function Bonus(categories, type, value, name, duration) {
	this.categories = (Array.isArray(categories)) ? categories : [categories];
	this.type = type;
	this.value = value;
	this.name = name;
	this.duration = duration;
	
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
	
	this.equals = function(other) {
		if (other === this) {
			return true;
		}
		if (!(other instanceof Bonus)) {
			return false;
		}
		return JSON.stringify(this.categories)==JSON.stringify(other.categories) &&
			this.type === orher.type &&
			this.value === other.value &&
			this.name === other.name;
	};
}



/*function createBonus(bonusName, bonusType, categories, initValue) {
	var bonus = new BonusProperty(categories, bonusType, initValue, bonusName);
	return bonus;
}*/

function BonusEffect(source, bonus) {
	this.source = source;
	this.bonus = bonus;
	this.isActive = undefined;
	this.currentDuration = 0;
	
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
		this.currentDuration = 0;
		for (var i = 0; i< bonus.categories.length; i++) {
			var category = bonus.categories[i];
			triggerModelChange(category, this);
		}
	};
	
	this.nextRound = function(count) {
		if (count === undefined) {
			count = 1;
		}
		if (this.bonus.duration === undefined) {
			return;
		}
		this.currentDuration++;
		if (this.currentDuration > this.bonus.duration) {
			this.deactivate();
		}
	};
	
	
}

function BonusEffectList(source, bonusList) {
	var _list = [];
	var _source = source;
	
	_add = function(bonusList) {
		if (bonusList === undefined) {
			return;
		}
		var list = (Array.isArray(bonusList)) ? bonusList : [bonusList];
		for (var i = 0; i < list.length; i++) {
			if (list[i] instanceof Bonus) {
				_list.push(list[i].toBonusEffect(_source));
			}
		}
	};
	
	_add(bonusList);
	
	_apply = function(callback, _list) {
		for (var i = 0; i < _list.length; i++) {
			var element = _list[i];
			if (Utils.isFunction(element[callback])) {
				element[callback](_source);
			}
		}
	};
	
	_remove = function(bonus) {
		var index = -1;
		for (var i = 0; i<_list.length; i++) {
			if(_list[i].equals(bonus)) {
				index = i;
			}
		}
		if (index != -1) {
			_list.splice(index, 1);
		}
	};
	
	return {
		activate : function() {
			_apply("activate", _list);
		},
		
		deactivate : function() {
			_apply("deactivate", _list);
		},	
		
		add : _add,
		
		remove : _remove,
		
		addAndActivate : function(bonus) {
			//_apply("deactivate");
			_add(bonus);
			_apply("activate",_list);
		},
		
		removeAndDeactivate : function(bonus) {
			bonus.deactivate(_source);
			_apply("deactivate", _list);
		}
	};
}


function BonusTypeGroup(type, isStacking) {
	this.type = type;
	this.isStacking = isStacking;
	this.sourceList = {};
	this.cachedValue = undefined;
	this.vsSomething = {};
	
	this.add = function(source, bonus) {
		this.remove(source);
		this.sourceList[source] = bonus;
		this.cachedValue = undefined;
	};
	
	this.remove = function(source) {
		if(this.sourceList.hasOwnProperty(source)) {
			delete this.sourceList[source];
		}
		this.cachedValue = undefined;
	};
	
	this.getBySource = function(source) {
		if (this.sourceList.hasOwnProperty(source)) {
			return this.sourceList[source].value;
		}
		return 0;
	}
	
	this.get = function(vsSomething) {
		if (this.cachedValue !== undefined && vsSomething === undefined) {
			return this.cachedValue;
		}
		var max = 0;
		var sum = 0;
		for (var source in this.sourceList) {
			var bonus = this.sourceList[source];
			if (bonus.vsSomething !== vsSomething) {
				continue;
			}
			if (bonus.value > max) {
				max = bonus.value;
			}
			sum += bonus.value;
		}
		var value;
		if (this.isStacking) {
			value = sum;
		} else {
			value = max;
		}
		if (vsSomething === undefined) {
			this.cachedValue = value;
		}
		return value;
	};
	
	this.getVsEverything = function() {
		var obj = {};
		obj.base = this.get();
		for (var vs in this.vsSomething) {
			obj[vs] = this.get(vs);
		}
		
	};
	
	this.nextRound = function(count) {
		for (var source in this.sourceList) {
			this.sourceList[source].nextRound(count);
		}
	};
	
}



function BonusProcessor() {
	var _list = {};
	var cachedValue;
	
	return {
		add : function(source, bonus) {
			if (!(bonus instanceof Bonus)) {
				throw bonus + " is not a bonus";
			}
			if (!_list.hasOwnProperty(bonus.type)) {
				_list[bonus.type] = new BonusTypeGroup(bonus.type, bonus.isStacking);
			}
			_list[bonus.type].add(source, bonus);
			
			this.cachedValue = undefined;
		},
		
		remove : function(source, bonus) {
			if (!(bonus instanceof Bonus)) {
				throw bonus + " is not a bonus";
			}
			if (_list.hasOwnProperty(bonus.type)) {
				_list[bonus.type].remove(source);
			}
			this.cachedValue = undefined;
		},
		
		getValue : function() {
			if (this.cachedValue !== undefined) {
				return this.cachedValue;
			}
			var value = 0;
			for (var i in _list) {
				value += _list[i].get();
			}
			this.cachedValue = value;
			return value;
		},
		
		getValueBySource : function(source) {
			var value = 0;
			for (var i in _list) {
				value += _list[i].getBySource(source);
			}
			return value;
		},
		
		getValueByType : function(type) {
			if (_list.hasOwnProperty(type)) {
				return _list[type].get();
			}
			return 0;
		},
		
		processBonusEffect : function(bonusEffect) {
			if (bonusEffect == undefined) {
				return;
			}
			if (!(bonusEffect instanceof BonusEffect)) {
				throw (bonus + " is not a BonusEffect");
			}
			var source = "UNKNOWN";
			if ( typeof bonusEffect.source === 'string' || bonusEffect.source instanceof String) {
				source = bonusEffect.source;
			} else if (bonusEffect.source.id !== undefined) {
				source = bonusEffect.source.id;
			} else if (bonusEffect.source.name !== undefined) {
				source = bonusEffect.source.name;
			}
			
			if (bonusEffect.isActive) {
				this.add(source, bonusEffect.bonus);
			} else {
				this.remove(source, bonusEffect.bonus);
			}
		},
		
		copy : function() {
			var copied = new BonusProcessor();
			for (let i in _list) {
				let bonusTypeGroup = _list[i];
				if (!(bonusTypeGroup instanceof BonusTypeGroup)) {
					continue;
				}
				for (let source in bonusTypeGroup.sourceList) {
					let bonus = bonusTypeGroup.sourceList[source];
					if (!(bonus instanceof Bonus)) {
						continue;
					}
					
					copied.add(source,bonus);
				}
			}
			return copied;
		},
		
		nextRound : function(count) {
			for (var i in _list) {
				_list[i].nextRound(count);
			}
		},
		
		list : _list
	};
}
