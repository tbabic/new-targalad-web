function Attack(offense, extraAttackBonus) {
	this.offense = offense;
	this.toHitBonusProcessor = offense.toHitBonusProcessor.copy();
	this.dmgBonusProcessor = offense.dmgBonusProcessor.copy();
	this.weaponSlot = (extraAttackBonus.weaponSlot !== undefined) ? extraAttackBonus.weaponSlot : "mainHand";
	this.attrToHit = "STRENGTH";
	this.attrDmg = "STRENGTH";
	this.attrDmgMul = (extraAttackBonus.attrDmgMul !== undefined) ? extraAttackBonus.attrDmgMul : 1.0;
	this.source = extraAttackBonus.source;
	this.dmg = 0;
	this.toHit = 0;
	this.offHand = false;
	
	
	
	if (this.weaponSlot == "offHand") {
		this.offHand = true;
	}
	
	this.getWeapon = function() {
		if (this.offHand) {
			return this.offense.character.equipment.shield
		}
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
	
	
	if (this.weaponSlot == "offHand") {
		for (bonusType in this.offense.toHitBonusProcessor.list) {
			bonusTypeGroup = this.toHitBonusProcessor.list[bonusType];
			if (bonusType == "ENHANCEMENT") {
				for (source in bonusTypeGroup.sourceList) {
					if (source == this.offense.mainHand.id) {
						this.toHitBonusProcessor.remove(source, bonusTypeGroup.sourceList[source]);
					}

				}
				
			}
		}
	}
	
	
	
	
	
	this.getToHit = function() {
		return +this.toHitBonusProcessor.getValue() + +this.attrToHit.getModifier();
	};
	
	this.getDmg = function() {
		let dmgModifier = this.attrDmg.getModifier();
		if (this.attrDmg.type == "STRENGTH" && this.getWeapon().category == WeaponCategory.MELEE_TWO_HANDED) {
			dmgModifier = Math.floor(1.5*dmgModifier);
		}
		if (this.offHand) {
			let twoWeaponRend = this.offense.character.getAbilityByName("Two-Weapon Rend");
			if (twoWeaponRend == undefined) {
				dmgModifier = Math.floor(0.5*dmgModifier);
			}
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
	
	addModelListener("WEAPON_TO_HIT", (e, bonusEffect) => {
		if (bonusEffect.source == this.getWeapon()) {
			this.toHitBonusProcessor.processBonusEffect(bonusEffect);
			this.toHit = this.getToHit();
		}
		
	});
	
	addModelListener("DAMAGE", (e, bonusEffect) => {
		this.dmgBonusProcessor.processBonusEffect(bonusEffect);
		this.dmg = this.getDmg();
	});
	
	addModelListener("WEAPON_DAMAGE", (e, bonusEffect) => {
		if (bonusEffect.source == this.getWeapon()) {
			this.dmgBonusProcessor.processBonusEffect(bonusEffect);
			this.dmg = this.getDmg();
		}
	});
	
	addModelListener("DAMAGE_DICE", "ADDED", (e, diceInfo) => {
		this.diceManager.addDice(diceInfo);
	});
	
	addModelListener("WEAPON_DAMAGE_DICE", "ADDED", (e, weapon, diceInfo) => {
		if (this.getWeapon() == weapon) {
			this.diceManager.addDice(diceInfo);
		}
		
	});
	
	addModelListener("DAMAGE_DICE", "REMOVED", (e, source) => {
		this.diceManager.removeDice(source);
	});
	
	addModelListener("WEAPON_DAMAGE_DICE", "REMOVED", (e, weapon, source) => {
		if (this.getWeapon() == weapon) {
			this.diceManager.removeDice(source);
		}
	});
	
	this.dmg = this.getDmg();
	this.toHit = this.getToHit();
	
	
	this.diceManager = new DiceManager();
	this.diceManager.addDice(new DiceInfo("WEAPON", "PHYSICAL", this.getWeapon().dmgDie));
	
	this.getWeapon().reactivate(this.offense.character);
	
	
}

function ExtraAttackBonus(source, weaponSlot, toHitBonus, dmgBonus, attrToHit, attrDmg) {
	this.source = source;
	this.weaponSlot = weaponSlot;
	this.toHitBonus = toHitBonus;
	this.dmgBonus = dmgBonus;
	this.attrToHit = "STRENGTH";
	this.attrDmg = "STRENGTH";
	this.attrDmgMul = 1.0;
}

function Offense(character) {
	
	
	this.character = character;
	this.attacks = {};
	
	this.attacksLimits = {}
	
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
	this.twoWeaponFighting = false;
	
	
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
	
	this.addAttacksLimit = function(numberOfAttacks, limitingAbility) {
		Vue.set(this.attacksLimits,limitingAbility,numberOfAttacks);
	};
	
	this.removeAttacksLimit = function(limitingAbility) {
		Vue.delete(this.attacksLimits, limitingAbility);
	};
	
	
	this.getAttacksLimit = function() {
		let limit = 100;
		for (let key in this.attacksLimits) {
			limit = Math.min(limit, this.attacksLimits[key]);
		}
		return limit;
	};
	
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
		limit = this.getAttacksLimit(attacks);
		return attacks.slice(0, limit);
	};
	
	this.getAttacksSorted = function() {
		var attacks = this.getAttacks();
		attacks.sort(function(attack1, attack2) {
			return attack2.getToHit() - attack1.getToHit();
		});
		
		limit = this.getAttacksLimit(attacks);
		return attacks.slice(0, limit);
	};
	
	this.getCmb = function() {
		return this.cmbBonusProcessor.getValue() + this.character.attributes.strength.getModifier();
	}
	
	this.getCmbWeapon = function() {
		return this.cmbWeaponBonusProcessor.getValue() + this.attrToHit.getModifier();
	}

	
	addModelListener("WEAPON", "ADDED", (e, weapon) => {
		this.mainHand = character.equipment.weapon;
		if (weapon.category == WeaponCategory.RANGED_TWO_HANDED || weapon.category == WeaponCategory.RANGED_ONE_HANDED) {
			this.attrToHit = this.character.attributes.getAttribute("DEXTERITY")
			this.attackOfOpportunity.attrToHit = this.attrToHit;
		
			for (key in this.attacks) {
				this.attacks[key].attrToHit = this.attrToHit;
			}
		}
		
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
	
	addModelListener("WEAPON_TO_HIT", (e, bonusEffect) => {
		if (this.character.equipment.weapon == bonusEffect.source) {
			this.cmbWeaponBonusProcessor.processBonusEffect(bonusEffect);
		}
		
	});
	
	addModelListener("WEAPON_DAMAGE", (e, bonusEffect) => {
		if (this.character.equipment.weapon == bonusEffect.source) {
			this.cmbWeaponBonusProcessor.processBonusEffect(bonusEffect);
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
	
	addModelListener("DISABLE_ITERATIVES", (e) => {
		let bab = this.getBab();
		let babPenalty = 5;
		while (babPenalty < bab) {
			this.removeAttack("BAB-"+babPenalty);
			babPenalty += 5;
		}

		
	});
	
	addModelListener("ENABLE_ITERATIVES", (e) => {
		let bab = this.getBab();
		let extraAttackBonus = new ExtraAttackBonus("BAB", "mainHand");
	
		let babPenalty = 5;
		while (babPenalty < bab) {
			
			var source = "BAB-"+babPenalty;
			extraAttackBonus.source = source;
			var attack = this.addAttack(extraAttackBonus);
			attack.addBonus(source, new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -babPenalty, source));
			babPenalty += 5;
		}
	});
	
}



