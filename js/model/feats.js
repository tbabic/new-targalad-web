function Feat(name, actionType, owner, propertiesOrActivate, activateOrDeactivate, deactivate) {
	Ability.call(this, name, actionType, owner, propertiesOrActivate, activateOrDeactivate, deactivate);
}

var FeatFactory = {
	weaponFinesse : function(owner) {
		return new Feat("Weapon Finesse", ActionType.PASSIVE, owner, function(character) {
			function apply(character) {
				if (character.attributes.dexterity.getModifier() <= character.attributes.strength.getModifier()) {
					return;
				}
				
				var attacks = character.offense.getAttacks();
				for(var i = 0; i < attacks.length; i++) {
					var attack = attacks[i];
					var attackWeapon = attack.getWeapon();
					if (attackWeapon.category == WeaponCategory.MELEE_LIGHT || 
						attackWeapon.type == WeaponType.RAPIER) {
						attack.attrToHit = character.attributes.dexterity;
					}
				}
			}
			
			apply(character);
			
			addModelListener("WEAPON", "ADDED", (e, weapon) => {
				apply(character);
			});
			
			addModelListener("WEAPON", "REMOVED", (e, weapon) => {
				apply(character);
			});
			
		});
	},
	
	dervishDance : function(owner) {
		return new Feat("Dervish dance", ActionType.PASSIVE, owner, function(character) {
			function apply(character) {
				if (character.attributes.dexterity.getModifier() <= character.attributes.strength.getModifier()) {
					return;
				}
				
				var attacks = character.offense.getAttacks();
				for(var i = 0; i < attacks.length; i++) {
					var attack = attacks[i];
					var attackWeapon = attack.getWeapon();
					if (attackWeapon.type == WeaponType.SCIMITAR) {
						attack.attrToHit = character.attributes.dexterity;
						attack.attrDmg = character.attributes.dexterity;
					}
				}
			}
			
			apply(character);
			
			addModelListener("WEAPON", "ADDED", (e, weapon) => {
				apply(character);
			});
			
			addModelListener("WEAPON", "REMOVED", (e, weapon) => {
				apply(character);
			});
			
		});
	},
	
	
	toughness : function(owner) {
		return new Feat("Toughness", ActionType.PASSIVE, owner, function(character) {
			
		});
	},
	
	arcaneStrike : function(owner) {
		var extraDmg = 1 + Math.floor(owner.level/5);
		return new Feat("Arcane Strike", ActionType.SWIFT, owner, new Bonus(BonusCategory.DAMAGE, BonusType.UNTYPED, extraDmg, "Arcane strike"));
	},
	
	intensifySpell : function(owner) {
		return new Feat("Intensify spell", ActionType.SWIFT, owner, function(character) {
			
		});
	},
};
