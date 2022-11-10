function Attack(offense, extraAttackBonus) {
	this.offense = offense;
	this.toHitBonusProcessor = offense.toHitBonusProcessor.copy();
	this.dmgBonusProcessor = offense.dmgBonusProcessor.copy();
	this.weaponSlot = (extraAttackBonus.weaponSlot !== undefined) ? extraAttackBonus.weaponSlot : "mainHand";
	this.attrToHit = "STRENGTH";
	this.attrDmg = "STRENGTH";
	this.source = extraAttackBonus.source;
	this.dmg = 0;
	this.toHit = 0;
	
	this.getWeapon = function() {
		return this.offense.character.equipment.weapon;
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
		return +this.toHitBonusProcessor.getValue() + +this.attrToHit.getModifier();
	};
	
	this.getDmg = function() {
		let dmgModifier = this.attrDmg.getModifier();
		if (this.attrDmg.type == "STRENGTH" && this.getWeapon().category == WeaponCategory.MELEE_TWO_HANDED) {
			dmgModifier = Math.floor(1.5*dmgModifier);
		}
		return this.dmgBonusProcessor.getValue() + dmgModifier;
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
		this.toHit = this.getToHit();
	});
	
	addModelListener("DAMAGE", (e, bonusEffect) => {
		this.dmgBonusProcessor.processBonusEffect(bonusEffect);
		this.dmg = this.getDmg();
	});
	
	this.dmg = this.getDmg();
	this.toHit = this.getToHit();
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
	this.cmbWeaponBonusProcessor = new BonusProcessor();
	this.cmbBonusProcessor = new BonusProcessor();
	this.extraAttackBonusProcessor = new BonusProcessor();
	this.attrToHit = character.attributes.strength;
	this.attrDmg = character.attributes.strength;
	this.mainHand = character.equipment.weapon;
	this.offHand = undefined;
	this.attackOfOpportunity = undefined;
	
	
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
		triggerModelChange("EXTRA_ATTACK", this.attacks[extraAttackBonus.source], "ADDED");
		return this.attacks[source];
	};
	
	this.removeAttack = function(source) {
		delete this.attacks[source];
	};
	
	var bab = this.getBab();
	this.toHitBonusProcessor.add("BAB", new Bonus(BonusCategory.TO_HIT, BonusType.BAB, bab, "BAB"));
	this.cmbBonusProcessor.add("BAB", new Bonus(BonusCategory.TO_HIT, BonusType.BAB, bab, "BAB"));
	this.cmbWeaponBonusProcessor.add("BAB", new Bonus(BonusCategory.TO_HIT, BonusType.BAB, bab, "BAB"));
	
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
	
	this.attackOfOpportunity = new Attack(this, extraAttackBonus);
	
	this.getAttacks = function() {
		var attacks = [];
		for (var source in this.attacks) {
			attacks.push(this.attacks[source]);
		}
		attacks.sort((a, b) => {
			let diff = b.getToHit() - a.getToHit();
			if (diff == 0) {
				b.getDmg() - a.getDmg();
			}
			return diff;
		});
		return attacks;
	};
	
	this.getAttacksSorted = function() {
		var attacks = this.getAttacks();
		attacks.sort(function(attack1, attack2) {
			return attack2.getToHit() - attack1.getToHit();
		});
		return attacks;
	};
	
	this.getCmb = function() {
		return this.cmbBonusProcessor.getValue() + this.character.attributes.strength.getModifier();
	}
	
	this.getCmbWeapon = function() {
		return this.cmbWeaponBonusProcessor.getValue() + this.attrToHit.getModifier();
	}

	
	addModelListener("WEAPON", "ADDED", (e, weapon) => {
		this.mainHand = character.equipment.weapon;
	});
	
	addModelListener("WEAPON", "REMOVED", (e, weapon) => {
		this.mainHand = character.equipment.weapon;
	});
	
	addModelListener("TO_HIT", (e, bonusEffect) => {
		this.toHitBonusProcessor.processBonusEffect(bonusEffect);
		this.cmbWeaponBonusProcessor.processBonusEffect(bonusEffect);
		if("ENHANCEMENT" != bonusEffect.bonus.type && !bonusEffect.bonus.type.includes("ENHANCEMENT") && !(bonusEffect.source == this.character.getAbilityByName("Weapon focus"))) {
			this.cmbBonusProcessor.processBonusEffect(bonusEffect);
		}
	});
	
	addModelListener("CMB", (e, bonusEffect) => {
		this.cmbWeaponBonusProcessor.processBonusEffect(bonusEffect);
		this.cmbBonusProcessor.processBonusEffect(bonusEffect);
	});
	
	addModelListener("DAMAGE", (e, bonusEffect) => {
		this.dmgBonusProcessor.processBonusEffect(bonusEffect);
	});
	
	addModelListener("EXTRA_ATTACK", (e, extraAttackBonus) => {
		this.addAttack(extraAttackBonus);
	});
	
}



