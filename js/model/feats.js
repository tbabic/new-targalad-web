var FeatFactory = {
	weaponFinesse : function(owner) {
		return getAbilityBuilder()
			.name("Weapon finesse")
			.actionType(ActionType.PASSIVE)
			.activate(function() {				
				function apply(owner) {
					if (owner.attributes.dexterity.getModifier() <= owner.attributes.strength.getModifier()) {
						return;
					}
					
					var attacks = owner.offense.getAttacks();
					for(var i = 0; i < attacks.length; i++) {
						var attack = attacks[i];
						var attackWeapon = attack.getWeapon();
						if (attackWeapon.category == WeaponCategory.MELEE_LIGHT || 
							attackWeapon.type == WeaponType.RAPIER) {
							attack.attrToHit = owner.attributes.dexterity;
							
							owner.offense.attrToHit = owner.attributes.dexterity;
						}
					}
				}
				
				apply(this.owner);
				
				addModelListener("WEAPON", "ADDED", (e, weapon) => {
					apply(this.owner);
				});
				
				addModelListener("WEAPON", "REMOVED", (e, weapon) => {
					apply(this.owner);
				});
				
				addModelListener("EXTRA_ATTACK", "ADDED", (e, attack) => {
					apply(this.owner);
				});
			})
			.owner(owner)
			.get();
	},
	
	dervishDance : function(owner) {
		return getAbilityBuilder()
			.name("Dervish Dance")
			.actionType(ActionType.PASSIVE)
			.activate(function() {
				function apply(owner) {
					if (owner.attributes.dexterity.getModifier() <= owner.attributes.strength.getModifier()) {
						return;
					}
					
					var attacks = owner.offense.getAttacks();
					for(var i = 0; i < attacks.length; i++) {
						var attack = attacks[i];
						var attackWeapon = attack.getWeapon();
						if (attackWeapon.type == WeaponType.SCIMITAR) {
							attack.attrToHit = owner.attributes.dexterity;
							attack.attrDmg = owner.attributes.dexterity;
							
							owner.offense.attrToHit = owner.attributes.dexterity;
						}
					}
				}
				
				apply(this.owner);
				
				addModelListener("WEAPON", "ADDED", (e, weapon) => {
					apply(this.owner);
				});
				
				addModelListener("WEAPON", "REMOVED", (e, weapon) => {
					apply(this.owner);
				});
				
				addModelListener("EXTRA_ATTACK", "ADDED", (e, attack) => {
					apply(this.owner);
				});
				
			})
			.owner(owner)
			.get();
	},
	
	dodge : function(owner) {
		return getAbilityBuilder()
			.name("Dodge")
			.actionType(ActionType.PASSIVE)
			.activate(function() {
				this.bonusEffectList = new BonusEffectList(this, new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DODGE, 1, this.name));
				this.bonusEffectList.activate();
				
			})
			.owner(owner)
			.get();
	},
	
	fatesFavored : function(owner) {
		return getAbilityBuilder()
			.name("Fate's Favored")
			.actionType(ActionType.PASSIVE)
			.owner(owner)
			.get();
	},
	
	craneStyle : function(owner) {
		return getAbilityBuilder()
			.name("Crane Style")
			.actionType(ActionType.PASSIVE)
			.owner(owner)
			.get();
	},
	
	cautiousWarrior : function(owner) {
		return getAbilityBuilder()
			.name("Cautious Warrior")
			.actionType(ActionType.PASSIVE)
			.owner(owner)
			.get();
	},
	
	ragingVitality : function(owner) {
		return getAbilityBuilder()
			.name("Raging Vitality")
			.actionType(ActionType.PASSIVE)
			.owner(owner)
			.get();
	},
	
	toughness : function(owner) {
		return getAbilityBuilder()
			.name("Toughness")
			.actionType(ActionType.PASSIVE)
			.owner(owner)
			.get();
	},
	
	intensifySpell : function(owner) {
		return getAbilityBuilder()
			.name("Intensify spell")
			.actionType(ActionType.PASSIVE)
			.owner(owner)
			.get();
	},
	
	arcaneStrike : function(owner) {
		return getAbilityBuilder()
			.name("Arcane Strike")
			.actionType(ActionType.SWIFT)
			.activate(function() {
				var extraDmg = 1 + Math.floor(owner.level/5);
				this.bonusEffectList = new BonusEffectList(this, new Bonus(BonusCategory.DAMAGE, BonusType.UNTYPED, extraDmg, this.name));
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
	
	powerAttack : function(owner) {
		return getAbilityBuilder()
			.name("Power Attack")
			.actionType(ActionType.FREE)
			.activate(function() {
				var modifier = 1 + Math.floor(owner.getBab()/4);
				var toHitPenalty = -modifier;
				var dmgBonus = 2*modifier;
				
				if(owner.equipment.weapon.category == WeaponCategory.MELEE_TWO_HANDED) {
					dmgBonus = Math.floor(dmgBonus*1.5);
				}
				
				this.bonusEffectList = new BonusEffectList(this, new Bonus(BonusCategory.DAMAGE, BonusType.UNTYPED, dmgBonus, this.name));
				this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, toHitPenalty, this.name));
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
	
	weaponFocus : function(owner) {
		return getAbilityBuilder()
			.name("Weapon focus")
			.actionType(ActionType.PASSIVE)
			.activate(function() {
				this.bonusEffectList = new BonusEffectList(this, new Bonus(BonusCategory.TO_HIT, BonusType.UNTYPED, 1, this.name));
				this.bonusEffectList.activate();
			})
			.owner(owner)
			.get();
	}
};

