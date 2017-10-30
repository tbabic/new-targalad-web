function Equipment() {
	this.armor;
	this.weapon;
	this.shield;
	
	this.head;
	this.headband;
	this.eyes;
	this.shoulders;
	this.neck;
	this.chest;
	this.body;
	this.belt;
	this.wrists;
	this.hands;
	this.leftRing;
	this.rightRing;
	this.slotless;
	
	this.addItem = function(item){
		if (item instanceof Armor) {
			this.armor = item;
		}
		else if (item instanceof Weapon) {
			this.weapon = item;
		} else if(item instanceof Item) {
			this[item.slot] = item;
			if (item.f) {
				item.f(this.character);
			}
		}
	}
	
	this.addArmor = function(armor) {
	}
	
	this.addWeapon = function(weapon) {
	}
	
	this.addSecondWeapon = function(weapon) {
		this.addShield(weapon);
	}
	
	this.addShield = function(shield) {
	}
	
	this.addRing = function() {
	}
	
	this.addLeftRing = function() {
	}
	
	this.addRightRing= function() {
	}
	
	
	
}


function Armor(name, type, armorBonus, maxDexBonus, enhancement, armorCheckPenalty, arcaneSpellCastingFailure, weight) {
	this.name = name;
	this.type = type;
	this.armorBonus = {
		category : 'defense',
		bonusType : 'armor',
		value : armorBonus+enhancement
	}
	this.maxDexBonus = maxDexBonus;
	this.armorCheckPenalty = armorCheckPenalty;
	this.arcaneSpellCastingFailure = arcaneSpellCastingFailure;
	this.weight = weight;
	this.enhancement = enhancement;
}

function Weapon(name, type, die, enhancement, dmgType, weight) {
	this.name = name;
	this.type = type;
	this.weaponBonus = {
		category : 'offense',
		bonusType : 'enhancement',
		value : enhancement
	}
	this.dmgType = dmgType;
	this.weight = weight;
	this.enhancement = enhancement;
}

function Item(name, slot, property, callback) {
	this.name = name;
	this.slot = slot;
	this.property = property;
	if(callback) {
		callback();
	}
	
}