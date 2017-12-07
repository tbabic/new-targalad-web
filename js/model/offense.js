function Attack(offense, extraAttackBonus) {
	this.offense = offense;
	this.toHitBonusProcessor = offense.toHitBonusProcessor.copy();
	this.dmgBonusProcessor = offense.dmgBonusProcessor.copy();
	this.weaponSlot = (extraAttackBonus.weaponSlot !== undefined) ? extraAttackBonus.weaponSlot : "mainHand";
	this.attrToHit = "STRENGTH";
	this.attrDmg = "STRENGTH";
	this.source = extraAttackBonus.source;
	
	this.getWeapon = function() {
		return this.offense[this.weaponSlot];
	};
	
	if(extraAttackBonus.attrToHit === undefined) {
		var weapon = this.getWeapon();
		if (weapon.category == WeaponCategory.RANGED_TWO_HANDED || weapon.category == WeaponCategory.RANGED_ONE_HANDED) {
			this.attrToHit = "DEXTERITY";
		}
	}
	else if (extraAttackBonus.attrToHit instanceof Attribute) {
		this.attrToHit = extraAttackBonus.attrToHit;
	} else {
		this.attrToHit = offense.character.attributes.getAttribute(extraAttackBonus.attrToHit);
	}
	
	if(extraAttackBonus.attrToHit === undefined) {
		this.attrDmg = "STRENGTH";
	}
	else if (extraAttackBonus.attrDmg instanceof Attribute) {
		this.attrDmg = extraAttackBonus.attrDmg;
	} else {
		this.attrDmg = offense.character.attributes.getAttribute(extraAttackBonus.attrDmg);
	}
	
	this.getToHit = function() {
		return this.toHitBonusProcessor.getValue() + this.attrToHit.getModifier();
	};
	
	this.getDmg = function() {
		return this.dmgBonusProcessor.getValue() + this.attrDmg.getModifier();
	};
	
	this.addBonus = function(source, toHitBonus, dmgBonus) {
		if (source === undefined) {
			return;
		}
		if (toHitBonus !== undefined) {
			this.toHitBonusProcessor.add(source,toHitBonus);
		}
		if (dmgBonus !== undefined) {
			this.dmgBonusBonusProcessor.add(source,dmgBonus);
		}
	};
	
	this.addBonus(extraAttackBonus.source, extraAttackBonus.toHitBonus, extraAttackBonus.dmgBonus);
	
	
	
	
	addModelListener("TO_HIT", (e, bonusEffect) => {
		this.toHitBonusProcessor.processBonusEffect(bonusEffect);
		triggerViewChange("OFFENSE");
	});
	
	addModelListener("DAMAGE", (e, bonusEffect) => {
		this.dmgBonusProcessor.processBonusEffect(bonusEffect);
		triggerViewChange("OFFENSE");
	});
	
}

function ExtraAttackBonus(source, weaponSlot, toHitBonus, dmgBonus, attrToHit, attrDmg) {
	this.source = source;
	this.weaponSlot = weaponSlot;
	this.toHitBonus = toHitBonus;
	this.dmgBonus = dmgBonus;
	this.attrToHit = "STRENGTH";
	this.attrDmg = "STRENGTH";
}

function Offense(character) {
	
	
	this.character = character;
	this.attacks = {};
	
	
	this.toHitBonusProcessor = new BonusProcessor();
	this.dmgBonusProcessor = new BonusProcessor();
	this.extraAttackBonusProcessor = new BonusProcessor();
	this.attrToHit = character.attributes.dexterity;
	this.attrDmg = character.attributes.dexterity;
	this.mainHand = character.equipment.weapon;
	this.offHand = undefined;
	if (character.equipment.shield instanceof Weapon) {
		this.offhand = character.equipment.shield;
	}
	
	this.getBab = function() {
		return this.character.getBab();
	};
	
	this.addAttack = function(extraAttackBonus) {
		if (this.attacks.hasOwnProperty(extraAttackBonus.source)) {
			this.attacks[extraAttackBonus.source].addBonus(extraAttackBonus.source, extraAttackBonus.toHitBonus, extraAttackBonus.dmgBonus);
		} else {
			this.attacks[extraAttackBonus.source] = new Attack(this, extraAttackBonus);
		}
		triggerModelChange("EXTRA_ATTACK", this.attacks[extraAttackBonus.source], "ADDED")
		triggerViewChange("OFFENSE", this);
		return this.attacks[source];
	};
	
	this.removeAttack = function(source) {
		delete this.attacks[source];
		triggerViewChange("OFFENSE", this);
	}
	
	var bab = this.getBab();
	this.toHitBonusProcessor.add("BAB", new Bonus(BonusCategory.TO_HIT, BonusType.BAB, bab, "BAB"));
	
	var extraAttackBonus = new ExtraAttackBonus("BAB", "mainHand");
	
	this.addAttack(extraAttackBonus);
	var babPenalty = 5;
	while (babPenalty < bab) {
		
		var source = "BAB-"+babPenalty;
		extraAttackBonus.source = source;
		var attack = this.addAttack(extraAttackBonus);
		attack.addBonus(source, new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -babPenalty, source));
		babPenalty += 5;
	}
	
	
	
	this.getAttacks = function() {
		var attacks = [];
		for (var source in this.attacks) {
			attacks.push(this.attacks[source]);
		}
		return attacks;
	};

	
	addModelListener("WEAPON", "ADDED", (e, weapon) => {
		this.mainHand = character.equipment.weapon;
		if (this.character.equipment.shield instanceof Weapon ) {
			this.offHand = this.equipment.shield;
		}
		triggerViewChange("OFFENSE", this);
	});
	
	addModelListener("WEAPON", "REMOVED", (e, weapon) => {
		this.mainHand = character.equipment.weapon;
		if (this.character.equipment.shield instanceof Weapon ) {
			this.offHand = this.equipment.shield;
		}
		triggerViewChange("OFFENSE", this);
	});
	
	addModelListener("TO_HIT", (e, bonusEffect) => {
		this.toHitBonusProcessor.processBonusEffect(bonusEffect);
		triggerViewChange("OFFENSE", this);
	});
	
	addModelListener("DAMAGE", (e, bonusEffect) => {
		this.dmgBonusProcessor.processBonusEffect(bonusEffect);
		triggerViewChange("OFFENSE", this);
	});
	
	addModelListener("EXTRA_ATTACK", (e, extraAttackBonus) => {
		this.addAttack(extraAttackBonus);
		triggerViewChange("OFFENSE", this);
	});
	
}



