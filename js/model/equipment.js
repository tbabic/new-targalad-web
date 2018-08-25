function Equipment() {
	this.armor = undefined;
	this.weapon = new Weapon("hands", WeaponType.UNARMED, 0, 0);
	this.shield = undefined;
	
	this.head = undefined;
	this.headband = undefined;
	this.eyes = undefined;
	this.shoulders = undefined;
	this.neck = undefined;
	this.chest = undefined;
	this.body = undefined;
	this.belt = undefined;
	this.wrists = undefined;
	this.hands = undefined;
	this.feet = undefined;
	this.leftRing = undefined;
	this.rightRing = undefined;
	this.inventory = [];
	
	
	this.addItem = function(item){
		if (item instanceof Armor) {
			this.addArmor(item);
		}
		else if (item instanceof Weapon) {
			this.addWeapon(item);
		}
		else if(!(item instanceof Item)) {
			this.inventory.push(item);
		}
		else if (!item.slot || item.slot == 'slotless' || item.slot == 'inventory' || item.slot === '') {
			this.inventory.push(item);
			item.equip();
		}				
		else if (item.slot == 'ring') {
			this.addRing(item);
		}
		else if (item.slot in this) {
			this.addItemToSlot(item, item.slot);
		} else {
			this.inventory.push(item);
		}
	};
	
	this.addArmor = function(armor) {
		if (this.armor !== undefined && Utils.isFunction(this.armor.unequip)) {
			this.armor.unequip();
		}
		this.armor = armor;
		armor.equip();
	};
	
	this.addWeapon = function(weapon) {
		if (this.weapon !== undefined && Utils.isFunction(this.weapon.unequip)) {
			this.weapon.unequip();
		}
		this.weapon = weapon;
		if ([WeaponCategory.MELEE_TWO_HANDED, WeaponCategory.RANGED_TWO_HANDED].indexOf(weapon.category))
		weapon.equip();
	};
	
	this.addSecondWeapon = function(weapon) {
		this.addShield(weapon);
	};
	
	this.addShield = function(shield) {
		if (this.shield !== undefined && Utils.isFunction(this.shield.unequip)) {
			this.shield.unequip();
		}
		this.shield = shield;
		item.equip();
	};
	
	this.addRing = function(item) {
		if (this.leftRing === undefined) {
			this.addLeftRing(item);
		} else if (this.rightRing === undefined) {
			this.addRightRing(item);
		} else {
			this.inventory.push(item);
		}
	};
	
	this.addLeftRing = function(item) {
		if (this.leftRing !== undefined && Utils.isFunction(this.item.unequip)) {
			this.leftRing.unequip();
		}
		this.leftRing = item;
		item.equip();
	};
	
	this.addRightRing= function(item) {
		if (this.rightRing !== undefined && isFunction(this.item.unequip)) {
			this.rightRing.unequip();
		}
		this.rightRing = item;
		item.equip();
	};
	
	this.addItemToSlot = function(item, slot) {
		if (slot === 'inventory') {
			this.inventory.push(item);
			equipItem(item);
		}
		else if (slot in this) {
			if (this[slot] !== undefined && Utils.isFunction(this[slot].unequip)) {
				this[slot].unequip();
			}
			this[slot] = item;
			item.equip();
		} else {
			throw "can't put item: " + item + " to slot: " + slot;
		}
	};
	
	this.findByPropertyCategory = function(propertyCategories) {
		var items = [];
		for (var slot in this) {
			var item = this[slot];
			if (item && item.property && item.property.category){
				var found = false;
				var itemCategory = item.property.category;
				if (Array.isArray(propertyCategories)&& propertyCategories.contains(itemCategory)) {
					found = true;
				}
				else if (itemCategory == propertyCategories) {
					found = true;
				}
				if (found) {
					items.push(item);
				}
			}
		}
		return items;
	};
}

function Item(name, slot, properties, weight, activate) {
	this.name = name;
	this.slot = slot;
	if (slot === '' || slot === 'inventory' || slot === 'slotless') {
		this.slot = 'inventory';
	}
	
	this.properties = new BonusEffectList(this, properties);
	this.activate = activate;
	this.id = idGenerator.generate();
	
	
	this.equip = function() {
		this.properties.activate();
	};
	
	this.unequip = function() {
		this.properties.deactivate();
	};
	
	this.addProperty = function(property) {
		this.properties.add(property);
		this.properties.activate();
	};
	
	this.removeProperty = function(property) {
		this.properties.removeAndDeactivate(property);
	};
	
	this.addTempProperty = function(property) {
		if (this.tempProperties === undefined) {
			this.tempProperties = new BonusEffectList(this, properties);
			this.tempProperties.activate();
		} else {
			this.tempProperties.addAndActivate(property);
		}
	};
		
	this.removeAllTempProperties = function() {
		this.tempProperties.deactivate();
		delete this.tempProperties;
		this.properties.activate();
	};
	
	this.removeTempProperty = function(property) {
		if (this.tempProperties === undefined) {
			return;
		}
		this.tempProperties.removeAndDeactivate(property);
	};
}


function Armor(name, type, armorBonus, maxDexBonus, enhancement, armorCheckPenalty, arcaneSpellCastingFailure, weight, properties) {
	
	this.type = type;
	Item.call(this, name, "armor", properties, weight);
	
	
	this.armorBonus = new Bonus(BonusCategory.ARMOR_CLASS, BonusType.ARMOR, armorBonus + enhancement, "Armor bonus");
	this.maxDexBonus = maxDexBonus;
	this.armorCheckPenalty = armorCheckPenalty;
	this.arcaneSpellCastingFailure = arcaneSpellCastingFailure;
	this.enhancement = enhancement;
	
	this.equip = function() {
		triggerModelChange("ARMOR", this, "ADDED");
		this.properties.activate(this);
	};
	
	this.unequip = function() {
		triggerModelChange("ARMOR", this, "REMOVED");
		triggerModelChange(armor.id, this, "REMOVED");
		this.properties.deactivate(this);
	};
	

}

var WeaponCategory = {
	MELEE_LIGHT : "MELEE_LIGHT",
	MELEE_ONE_HANDED : "MELEE_ONE_HANDED",
	MELEE_TWO_HANDED : "MELEE_TWO_HANDED",
	RANGED_ONE_HANDED : "RANGED_ONE_HANDED",
	RANGED_TWO_HANDED : "RANGED_TWO_HANDED"
};

var WeaponType = {
	TOUCH : "TOUCH",
	UNARMED : "UNARMED",
	
	DAGGER : "DAGGER",
	LIGHT_MACE: "LIGHT_MACE",
	HANDAXE : "HANDAXE",
	KUKRI : "KUKRI",
	SHORT_SWORD : "SHORT_SWORD",
	
	CLUB : "CLUB",
	HEAVY_MACE : "HEAVY_MACE",
	MORNINGSTAR : "MORNINGSTAR",
	SHORTSPEAR : "SHORTSPEAR",
	BATTLE_AXE : "BATTLE_AXE",
	FLAIL : "FLAIL",
	LONGSWORD : "LONGSWORD",
	RAPIER : "RAPIER",
	SCIMITAR : "SCIMITAR",
	
	LONGSPEAR : "LONGSPEAR",
	QUARTERSTAFF : "QUARTERSTAFF",
	SPEAR : "SPEAR",
	BARDICHE : "BARDICHE",
	FALCHION : "FALCHION",
	HEAVY_FLAIL : "HEAVY_FLAIL",
	GLAIVE : "GLAIVE",
	GREATAXE : "GREATAXE",
	GREATCLUB : "GREATCLUB",
	GREATSWORD : "GREATSWORD",
	GUISARME : "GUISARME",
	HALBERD : "HALBERD",
	LANCE : "LANCE",
	
	SHORTBOW : "SHORTBOW",
	LONGBOW : "LONGBOW",
	COMPOSITE_LONGBOW : "COMPOSITE_LONGBOW",
	
	properties : {
		TOUCH : {category : WeaponCategory.MELEE_LIGHT, dmgDie : "", threat : 20, multiplier : 2},
		UNARMED : {category : WeaponCategory.MELEE_LIGHT, dmgDie : "d3", threat : 20, multiplier : 2},
		
		DAGGER : {category : WeaponCategory.MELEE_LIGHT, dmgDie : "d4", threat : 19, multiplier : 2},
		LIGHT_MACE : {category : WeaponCategory.MELEE_LIGHT, dmgDie : "d6", threat : 20, multiplier : 2},
		HANDAXE : {category : WeaponCategory.MELEE_LIGHT, dmgDie : "d6", threat : 20, multiplier : 3},
		KUKRI : {category : WeaponCategory.MELEE_LIGHT, dmgDie : "d4", threat : 18, multiplier : 2},
		SHORT_SWORD : {category : WeaponCategory.MELEE_LIGHT, dmgDie : "d6", threat : 19, multiplier : 2},
		
		CLUB : {category : WeaponCategory.MELEE_ONE_HANDED, dmgDie : "d6", threat : 20, multiplier : 2},
		HEAVY_MACE : {category : WeaponCategory.MELEE_ONE_HANDED, dmgDie : "d8", threat : 20, multiplier : 2},
		MORNINGSTAR : {category : WeaponCategory.MELEE_ONE_HANDED, dmgDie : "d8", threat : 20, multiplier : 2},
		SHORTSPEAR : {category : WeaponCategory.MELEE_ONE_HANDED, dmgDie : "d6", threat : 20, multiplier : 2},
		BATTLE_AXE : {category : WeaponCategory.MELEE_ONE_HANDED, dmgDie : "d8", threat : 20, multiplier : 3},
		FLAIL : {category : WeaponCategory.MELEE_ONE_HANDED, dmgDie : "d8", threat : 20, multiplier : 2},
		LONGSWORD : {category : WeaponCategory.MELEE_ONE_HANDED, dmgDie : "d8", threat : 19, multiplier : 2},
		RAPIER : {category : WeaponCategory.MELEE_ONE_HANDED, dmgDie : "d6", threat : 18, multiplier : 2},
		SCIMITAR : {category : WeaponCategory.MELEE_ONE_HANDED, dmgDie : "d6", threat : 18, multiplier : 2},
		
		LONGSPEAR : {category : WeaponCategory.MELEE_TWO_HANDED, dmgDie : "d8", threat : 20, multiplier : 3},
		QUARTERSTAFF : {category : WeaponCategory.MELEE_TWO_HANDED, dmgDie : "d6", threat : 20, multiplier : 2},
		SPEAR : {category : WeaponCategory.MELEE_TWO_HANDED, dmgDie : "d8", threat : 20, multiplier : 3},
		BARDICHE : {category : WeaponCategory.MELEE_TWO_HANDED, dmgDie : "d10", threat : 19, multiplier : 2},
		FALCHION : {category : WeaponCategory.MELEE_TWO_HANDED, dmgDie : "2d4", threat : 18, multiplier : 2},
		HEAVY_FLAIL : {category : WeaponCategory.MELEE_TWO_HANDED, dmgDie : "d10", threat : 19, multiplier : 2},
		GLAIVE : {category : WeaponCategory.MELEE_TWO_HANDED, dmgDie : "d10", threat : 20, multiplier : 3},
		GREATAXE : {category : WeaponCategory.MELEE_TWO_HANDED, dmgDie : "d12", threat : 20, multiplier : 3},
		GREATCLUB2 : {category : WeaponCategory.MELEE_TWO_HANDED, dmgDie : "d10", threat : 20, multiplier : 2},
		GREATSWORD : {category : WeaponCategory.MELEE_TWO_HANDED, dmgDie : "2d6", threat : 19, multiplier : 2},
		GUISARME : {category : WeaponCategory.MELEE_TWO_HANDED, dmgDie : "2d4", threat : 20, multiplier : 3},
		HALBERD : {category : WeaponCategory.MELEE_TWO_HANDED, dmgDie : "d10", threat : 20, multiplier : 3},
		
		SHORTBOW : {category : WeaponCategory.RANGED_TWO_HANDED, dmgDie : "d6", threat : 20, multiplier : 3},
		LONGBOW : {category : WeaponCategory.RANGED_TWO_HANDED, dmgDie : "d8", threat : 20, multiplier : 3},
		COMPOSITE_LONGBOW : {category : WeaponCategory.RANGED_TWO_HANDED, dmgDie : "d8", threat : 20, multiplier : 3}
	}
};




function Weapon(name, type, enhancement, weight, properties) {
	
	this.type = type;
	this.category = WeaponType.properties[type].category;
	this.weaponBonus = new Bonus([BonusCategory.TO_HIT, BonusCategory.DAMAGE], BonusType.ENHANCEMENT, enhancement, "Weapon bonus");
	this.enhancement = enhancement;
	this.dmgDie = WeaponType.properties[type].dmgDie;
	
	Item.call(this, name, "weapon", properties, weight);
	this.addProperty(this.weaponBonus);
	
	
	this.equip = function() {
		triggerModelChange("WEAPON", this, "ADDED");
		this.properties.activate(this);
	};
	
	this.unequip = function() {
		triggerModelChange("WEAPON", this, "REMOVED");
		this.properties.deactivate();
	};

}

