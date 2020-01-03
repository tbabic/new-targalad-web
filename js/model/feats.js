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
	}
};

