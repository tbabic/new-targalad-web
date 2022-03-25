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
	
	weaponFocus : function(owner, weaponType) {
		return getAbilityBuilder()
			.name("Weapon focus")
			.actionType(ActionType.PASSIVE)
			.activate(function() {
				if (this.bonusEffectList == undefined) {
					this.bonusEffectList = new BonusEffectList(this, new Bonus(BonusCategory.TO_HIT, BonusType.UNTYPED, 1, this.name));
				}
				this.usesFocusWeapon = false;
				if (owner.equipment.weapon.type == weaponType) {
					this.bonusEffectList.activate();
					this.usesFocusWeapon = true;
				}
				
				addModelListener("WEAPON", "ADDED", (e, weapon) => {
					if (this.usesFocusWeapon && weapon.type != weaponType) {
						this.bonusEffectList.deactivate();
						this.usesFocusWeapon = false;
					} else if (!this.usesFocusWeapon && weapon.type == weaponType) {
						this.bonusEffectList.activate();
						this.usesFocusWeapon = true;
					}
				});				
			})
			.owner(owner)
			.get();
	},
	dirtyFighter : function(owner) {
		return getAbilityBuilder()
			.name("Dirty Fighter")
			.actionType(ActionType.PASSIVE)
			.owner(owner)
			.get();
	},
	improvedUnarmedStrike : function(owner) {
		return getAbilityBuilder()
			.name("Unarmed Strike")
			.actionType(ActionType.FREE)
			.activate(function() {
				if (this.fist == undefined) {
					this.fist = new Weapon('Fist', WeaponType.UNARMED, +0, 0, undefined, undefined)
				}
				
				if (owner.equipment.weapon.type != WeaponType.UNARMED) {
					this.oldWeapon = owner.equipment.weapon;
					owner.addItem(this.fist);
				}
				
			})
			.deactivate(function() {
				if (owner.equipment.weapon.type == WeaponType.UNARMED) {
					owner.addItem(this.oldWeapon);
				}
				
			})
			.owner(owner)
			.get();
	},
	
	combatReflexes : function(owner) {
		return getAbilityBuilder()
			.name("Combat Reflexes")
			.actionType(ActionType.PASSIVE)
			.description("Benefit: You may make a number of additional attacks of opportunity per round equal to your Dexterity bonus. With this feat, you may also make attacks of opportunity while flat-footed.")
			.owner(owner)
			.get();
	},
	
	stalwart : function(owner) {
		return getAbilityBuilder()
			.name("Stalwart")
			.actionType(ActionType.FREE)
			.owner(owner)
			.get();
	},
	
	improvedStalwart : function(owner) {
		return getAbilityBuilder()
			.name("Improved Stalwart")
			.actionType(ActionType.PASSIVE)
			.owner(owner)
			.get();
	},
	
	diehard : function(owner) {
		return getAbilityBuilder()
			.name("Diehard")
			.actionType(ActionType.PASSIVE)
			.description("")
			.owner(owner)
			.get();
	},
	
	endurance : function(owner) {
		return getAbilityBuilder()
			.name("Endurance")
			.actionType(ActionType.PASSIVE)
			.description("Benefit: You gain a +4 bonus on the following checks and saves: Swim checks made to resist nonlethal damage from exhaustion; Constitution checks made to continue running; Constitution checks made to avoid nonlethal damage from a forced march; Constitution checks made to hold your breath; Constitution checks made to avoid nonlethal damage from starvation or thirst; Fortitude saves made to avoid nonlethal damage from hot or cold environments; and Fortitude saves made to resist damage from suffocation." +
				"\n\nYou may sleep in light or medium armor without becoming fatigued.")
			.owner(owner)
			.get();
	},
	
	ironWill : function(owner) {
		return getAbilityBuilder()
			.name("Iron Will")
			.actionType(ActionType.PASSIVE)
			.activate(function() {
				this.bonusEffectList = new BonusEffectList(this, new Bonus("WILL", BonusType.UNTYPED, 2, this.name));
				this.bonusEffectList.activate();
				
			})
			.owner(owner)
			.get();
	},
	zealous : function(owner) {
		return getAbilityBuilder()
			.name("Zealous")
			.actionType(ActionType.FREE)
			.activate(function() {

				this.bonusEffectList = new BonusEffectList(this, new Bonus(BonusCategory.DAMAGE, BonusType.UNTYPED, 2, this.name));
				this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -5, this.name));
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
};

