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
				if (owner.getAbilityByName("Furious Focus") != undefined) {
					this.furiousFocusBonus = new Bonus(BonusCategory.TO_HIT, BonusType.UNTYPED, modifier, this.name);
					owner.offense.getAttacks()[0].addBonus(this.name, this.furiousFocusBonus);
				}
				
			})
			.deactivate(function() {
				if (this.bonusEffectList !== undefined) {
					this.bonusEffectList.deactivate();
				}
				if (this.furiousFocusBonus != undefined) {
					this.furiousFocusBonus.deactivate(this.name);
				}
			})
			.owner(owner)
			.get();
	},
	
	furiousFocus : function(owner) {
		return getAbilityBuilder()
			.name("Furious Focus")
			.actionType(ActionType.PASSIVE)
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
					this.fist = new Weapon('Fist', WeaponType.UNARMED, +0)
					if (this.owner.level <= 5) {
						this.fist.dmgDie = "d6";
					}
					else if (this.owner.level <= 9) {
						this.fist.dmgDie = "d8";
					}
					else if (this.owner.level <= 13) {
						this.fist.dmgDie = "d10";
					}
					else if (this.owner.level <= 17) {
						this.fist.dmgDie = "2d6";
					}
					else {
						this.fist.dmgDie = "2d8";
					}
					
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
	
	bodyguard : function(owner) {
		return getAbilityBuilder()
			.name("Bodyguard")
			.actionType(ActionType.PASSIVE)
			.description("Benefit: When an adjacent ally is attacked, you may use an attack of opportunity to attempt the aid another action to improve your ally’s AC. You may not use the aid another action to improve your ally’s attack roll with this attack.")
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
	lightningReflexes : function(owner) {
		return getAbilityBuilder()
			.name("Lightning Reflexes")
			.actionType(ActionType.PASSIVE)
			.activate(function() {
				this.bonusEffectList = new BonusEffectList(this, new Bonus("REFLEX", BonusType.UNTYPED, 2, this.name));
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
	rapidShot : function(owner) {
		return getAbilityBuilder()
			.name("Rapid Shot")
			.actionType(ActionType.FREE)
			.activate(function() {

				this.bonusEffectList = new BonusEffectList(this);
				this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -2, this.name));
				this.bonusEffectList.activate();
				
				this.extraAttackBonus = new ExtraAttackBonus(this.name, "mainHand");
				this.extraAttackBonus.attrToHit = owner.offense.attrToHit;
				triggerModelChange("EXTRA_ATTACK", this.extraAttackBonus);
			})
			.deactivate(function() {
				if (this.bonusEffectList !== undefined) {
					this.bonusEffectList.deactivate();
				}
			
				if (this.extraAttackBonus !== undefined) {
					this.owner.offense.removeAttack(this.name);
					delete this.extraAttackBonus;
				}
			})
			.owner(owner)
			.get();
	},
	
	pointBlankShot : function(owner) {
		return getAbilityBuilder()
			.name("Point Blank Shot")
			.actionType(ActionType.FREE)
			.activate(function() {

				this.bonusEffectList = new BonusEffectList(this);
				this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.UNTYPED, 1, this.name));
				this.bonusEffectList.add(new Bonus(BonusCategory.DAMAGE, BonusType.UNTYPED, 1, this.name));
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
	
	masterSniper : function(owner) {
		return getAbilityBuilder()
			.name("Master Sniper")
			.actionType(ActionType.FREE)
			.activate(function() {

				this.bonusEffectList = new BonusEffectList(this);
				this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -2, this.name));
				this.bonusEffectList.activate();
				
				this.extraAttackBonus = new ExtraAttackBonus(this.name, "mainHand");
				this.extraAttackBonus.attrToHit = owner.offense.attrToHit;
				triggerModelChange("EXTRA_ATTACK", this.extraAttackBonus);
				owner.offense.addAttacksLimit(2, this.name);
			})
			.deactivate(function() {
				if (this.bonusEffectList !== undefined) {
					this.bonusEffectList.deactivate();
				}
			
				if (this.extraAttackBonus !== undefined) {
					this.owner.offense.removeAttack(this.name);
					delete this.extraAttackBonus;
				}
				owner.offense.removeAttacksLimit(this.name);
			})
			.owner(owner)
			.get();
	},
	
	twoWeaponFighting : function(owner) {
		return getAbilityBuilder()
			.name("Two-Weapon Fighting")
			.actionType(ActionType.FREE)
			.activate(function() {
				
				
				let offhand = owner.equipment.shield;
				if (offhand == undefined || !(offhand instanceof Weapon)) {
					return;
				}
				let penalty = -2;
				if (offhand.category != WeaponCategory.MELEE_LIGHT) {
					penalty = -4;
				};
				
				this.bonusEffectList = new BonusEffectList(this);
				this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, penalty, this.name));
				this.bonusEffectList.activate();
				
				this.extraAttackBonus = new ExtraAttackBonus(this.name, "offHand");
				let twoWeaponRend = this.owner.getAbilityByName("Two-Weapon Rend");
				if (twoWeaponRend != undefined) {
					this.extraAttackBonus.attrDmgMul = 1.0;
				}
				this.extraAttackBonus.attrToHit = owner.offense.attrToHit;
				triggerModelChange("EXTRA_ATTACK", this.extraAttackBonus);
				
			})
			.deactivate(function() {
				if (this.bonusEffectList !== undefined) {
					this.bonusEffectList.deactivate();
				}
				
				if (this.extraAttackBonus !== undefined) {
					this.owner.offense.removeAttack(this.name);
					delete this.extraAttackBonus;
				}
			})
			.owner(owner)
			.get();
	},
	
	twoWeaponRend : function(owner) {
		return getAbilityBuilder()
			.name("Two-Weapon Rend")
			.actionType(ActionType.PASSIVE)
			.owner(owner)
			.get();
	},
	
	outflank : function(owner) {
		return getAbilityBuilder()
			.name("Outflank")
			.actionType(ActionType.FREE)
			.activate(function() {
				this.preciseStrike = null;
				let flank = this.owner.getAbilityByName("Flank");
				if (flank != undefined && flank.active) {
					this.bonusEffectList = new BonusEffectList(this);
					this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.UNTYPED, 2, "Outflank"));
					this.bonusEffectList.activate()
					
					this.preciseStrike = this.owner.getAbilityByName("Precise Strike");
					if(this.preciseStrike != null) {
						triggerModelChange("DAMAGE_DICE",new DiceInfo(this.name, "PRECISION", "d6"), "ADDED");
					}
					
				}
				
				
				
			})
			.deactivate(function() {
				if (this.bonusEffectList !== undefined) {
					this.bonusEffectList.deactivate();
				}
				if(this.preciseStrike != null) {
					triggerModelChange("DAMAGE_DICE",this.name, "REMOVED");
				}
			})
			.owner(owner)
			.get();
	},
	
	preciseStrike : function(owner) {
		return getAbilityBuilder()
			.name("Precise Strike")
			.actionType(ActionType.PASSIVE)
			.owner(owner)
			.get();
	},
	
	cornugonSmash : function(owner) {
		return getAbilityBuilder()
			.name("Cornugon Smash")
			.actionType(ActionType.PASSIVE)
			.description("Benefit: When you damage an opponent with a Power Attack, you may make an immediate Intimidate check as a free action to attempt to demoralize your opponent. The DC of this check is equal to 10 + the target’s Hit Dice + the target’s Wisdom modifier.")
			.owner(owner)
			.get();
	},
	
	bane : function(owner) {
		return getAbilityBuilder()
			.name("Bane Baldric")
			.actionType(ActionType.FREE)
			.activate(function() {

				let weapon = owner.equipment.weapon;
				
				this.bane = WeaponProperties.BANE;
				
				weapon.weaponProperties.push(this.bane);
				this.bane.activate(weapon, this.owner);
				

			})
			.deactivate(function() {
				let weapon = owner.equipment.weapon;
				this.bane.deactivate();
				let found  = weapon.weaponProperties.findIndex(this.bane);
				if (found != -1) {
					weapon.weaponProperties.splice(found,1);
				}
				
			
			})
			.owner(owner)
			.get();
	},
	
	
	
	deliquescentGloves : function(owner) {
		return getAbilityBuilder()
			.name("Deliquescent Gloves")
			.actionType(ActionType.PASSIVE)
			.activate(function() {
				triggerModelChange("DAMAGE_DICE",new DiceInfo(this.name, "ACID", "d6"), "ADDED");
			})
			.owner(owner)
			.get();
	}
	
	
};

