var myCharacter;




bab = function(level) {
	return Math.floor(level * 0.75);
};

ActionType = {
	PASSIVE : "PASSIVE",
	FREE : "FREE",
	SWIFT : "SWIFT",
	IMMEDIATE : "IMMEDIATE",
	MOVE : "MOVE",
	STANDARD : "STANDARD",
	FULL_ROUND : "FULL_ROUND",
	MODAL : "MODAL"
};

function createVindred(level) {
	if (level == undefined) {
		level = 8;
	}
	var attributes = new Attributes(19, 14, 15, 11, 11, 14);
	var vindred = new Character('bloodrager', attributes, +level, 'equipment');
	
	furiousProperty  = {
	    name : "FURIOUS",
		activate : function(weapon) {
			let bloodrage = vindred.getAbilityByName("Bloodrage");
			bonusValue = 2; 
			this.bonus = new Bonus([BonusCategory.TO_HIT, BonusCategory.DAMAGE],  "ENHANCEMENT STACKING", bonusValue, 'Furious');
			bloodrage.properties.add(this.bonus);
		},
		deactivate : function() {
			let bloodrage = vindred.getAbilityByName("Bloodrage");
			bloodrage.properties.removeAndDeactivate(this.bonus);
		}
	}
	
	vindred.addItem(new Armor('Chainshirt +1', ArmorType.CHAINSHIRT, undefined, 4, 4, 0, 1, 20, 25, new Bonus(BonusCategory.ARMOR_CLASS, BonusType.ENHANCEMENT, 2, "Chainshirt +2")));
	vindred.addItem(new Weapon('Greatsword', WeaponType.GREATSWORD, +2, 4, undefined, furiousProperty));
	
	vindred.addItem(new Item('Cracked ioun stone', 'inventory', new Bonus(BonusCategory.TO_HIT, BonusType.COMPETENCE, 1, "Cracked ioun stone"), 0));
	vindred.addItem(new Item('Wayfinder (51)', 'inventory', new Bonus('REFLEX', BonusType.RESISTANCE, 1, "Wayfinder"), 0));
	vindred.addItem(new Item('Ring of Deflection +1', 'ring', new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DEFLECTION, 1, "Ring of Deflection +1"), 0));
	vindred.addItem(new Item('Amulet of Natural Armor +1', 'neck', new Bonus(BonusCategory.ARMOR_CLASS, BonusType.NATURAL_ARMOR, 1, "Amulet of Natural Armor +1"), 0));
	vindred.addItem(new Item('Belt of Giant Strength +4', 'belt', new Bonus('STRENGTH', BonusType.ENHANCEMENT, 4, "Belt of Giant Strength +4"), 0));
	vindred.addItem(new Item('Cloak of Resistance +1', 'shoulders', new Bonus('SAVES', BonusType.RESISTANCE, 1, "Cloak of Resistance +1"), 0));
	vindred.addItem(new Item('Headband of Charisma +2', 'headband', new Bonus('CHARISMA', BonusType.CHARISMA, 2, "Headband of Charisma +2"), 0));
	
	loadEquipmentFromStorage(vindred);
	
	vindred.addAbility(FeatFactory.powerAttack(vindred));
	vindred.addAbility(FeatFactory.dodge(vindred));
	vindred.addAbility(FeatFactory.fatesFavored(vindred));
	vindred.addAbility(FeatFactory.craneStyle(vindred));
	vindred.addAbility(FeatFactory.cautiousWarrior(vindred));
	vindred.addAbility(FeatFactory.ragingVitality(vindred));
	
	vindred.addAbility(BloodragePowerFactory.destinedStrike(vindred));
	vindred.addAbility(BloodragePowerFactory.fatedBloodrager(vindred));
	vindred.addAbility(BloodragePowerFactory.guardedStance(vindred));
	
	
	vindred.skillSet.getSkill(SkillsEnum.ACROBATICS).addRank(3);
	vindred.skillSet.getSkill(SkillsEnum.APPRAISE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.BLUFF).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.CLIMB).addRank(1);
	vindred.skillSet.getSkill(SkillsEnum.CRAFT_ALCHEMY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.CRAFT_ARMOR).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.CRAFT_WEAPON).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.DIPLOMACY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.DISABLE_DEVICE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.DISGUISE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.ESCAPE_ARTIST).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.FLY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.HANDLE_ANIMAL).addRank(1);
	vindred.skillSet.getSkill(SkillsEnum.HEAL).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.INTIMIDATE).addRank(8);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_ARCANA).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_DUNGEONEERING).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_ENGINEERING).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_GEOGRAPHY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_HISTORY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_LOCAL).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_NATURE).addRank(1);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_NOBILITY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_PLANES).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_RELIGION).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_MARTIAL).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.LINGUISTICS).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.PERCEPTION).addRank(7);
	vindred.skillSet.getSkill(SkillsEnum.PERFORM_DANCE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.PERFORM_SING).addRank(8);
	vindred.skillSet.getSkill(SkillsEnum.PERFORM_ORATORY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.PROFESSION).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.RIDE).addRank(1);
	vindred.skillSet.getSkill(SkillsEnum.SENSE_MOTIVE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.SLEIGHT_OF_HAND).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.SPELLCRAFT).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.STEALTH).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.SURVIVAL).addRank(1);
	vindred.skillSet.getSkill(SkillsEnum.SWIM).addRank(1);
	vindred.skillSet.getSkill(SkillsEnum.USE_MAGIC_DEVICE).addRank(0);
	
	console.log(vindred);
	
	
	myCharacter = vindred;
}

function createWhirlwind(level) {
	if (level == undefined) {
		level = 1;
	}
	var attributes = new Attributes(18, 14, 14, 10, 12, 13);
	var vindred = new Character('bloodrager', attributes, +level, 'equipment');
	
	furiousProperty  = {
	    name : "furious",
		activate : function(weapon) {
			let bloodrage = vindred.getAbilityByName("Bloodrage");
			bonusValue = 2; 
			this.bonus = new Bonus([BonusCategory.TO_HIT, BonusCategory.DAMAGE],  "ENHANCEMENT STACKING", bonusValue, 'Furious');
			bloodrage.properties.add(this.bonus);
		},
		deactivate : function() {
			bloodrage.bonusEffectList.removeAndDeactivate(this.bonus);
		}
	}
	
	vindred.addItem(new Armor('Hide armor', ArmorType.HIDE, undefined, 4, 3, 0, 1, 20, 25, new Bonus(BonusCategory.ARMOR_CLASS, BonusType.ENHANCEMENT, 0, "Hide armor")));
	vindred.addItem(new Weapon('Greatsword', WeaponType.BARDICHE, +0, 0, undefined, undefined));
	//vindred.addItem(new Weapon('Greatsword', WeaponType.BARDICHE, +0, 0, undefined, furiousProperty));
	
	
	
	vindred.addItem(new Item('Ring of Deflection +0', 'ring', new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DEFLECTION, 0, "Ring of Deflection +0"), 0));
	vindred.addItem(new Item('Amulet of Natural Armor +0', 'neck', new Bonus(BonusCategory.ARMOR_CLASS, BonusType.NATURAL_ARMOR, 0, "Amulet of Natural Armor +0"), 0));
	vindred.addItem(new Item('Belt of Giant Strength +0', 'belt', new Bonus('STRENGTH', BonusType.ENHANCEMENT, 0, "Belt of Giant Strength +0"), 0));
	vindred.addItem(new Item('Cloak of Resistance +1', 'shoulders', new Bonus('SAVES', BonusType.RESISTANCE, 1, "Cloak of Resistance +1"), 0));
	vindred.addItem(new Item('Headband of Charisma +0', 'headband', new Bonus('CHARISMA', BonusType.CHARISMA, 0, "Headband of Charisma +0"), 0));
	
	vindred.addItem(new Item('Headband of Charisma +0', 'headband', new Bonus('CHARISMA', BonusType.CHARISMA, 0, "Headband of Charisma +0"), 0));
	
	vindred.addItem(new Item('Dusty rose prism', 'inventory', new Bonus(BonusCategory.ARMOR_CLASS, BonusType.INSIGHT, 1, "Dusty rose prism"), 0));
	
	loadEquipmentFromStorage(vindred);
	
	vindred.addAbility(FeatFactory.dodge(vindred));
	vindred.addAbility(FeatFactory.fatesFavored(vindred));
	vindred.addAbility(BloodragePowerFactory.destinedStrike(vindred));
	
	vindred.addAbility(FeatFactory.cautiousWarrior(vindred));
	vindred.addAbility(FeatFactory.improvedUnarmedStrike(vindred));
	vindred.addAbility(FeatFactory.zealous(vindred));
	
	if (vindred.level >= 2) {
		vindred.addAbility(FeatFactory.craneStyle(vindred));
	}
	
	if (vindred.level >= 3) {
		vindred.addAbility(FeatFactory.powerAttack(vindred));
		vindred.addAbility(FeatFactory.dirtyFighter(vindred));
		vindred.skillSet.getSkill(SkillsEnum.ACROBATICS).addRank(2);
	}
	
	
	//vindred.addAbility(FeatFactory.ragingVitality(vindred));
	
	if (vindred.level >= 4) {
	
		vindred.addAbility(BloodragePowerFactory.fatedBloodrager(vindred));
		vindred.attributes.strength.value++;
	}
	
	if (vindred.level >= 5) {
		vindred.addAbility(FeatFactory.combatReflexes(vindred));
	}
	
	if (vindred.level >= 5) {
		vindred.addAbility(FeatFactory.bodyguard(vindred));
	}
	
	if (vindred.level >= 6) {
		vindred.addAbility(FeatFactory.endurance(vindred));
	}
	
	if (vindred.level >= 8) {
		vindred.addAbility(FeatFactory.diehard(vindred));
		vindred.attributes.strength.value++;
	}
	
	
	if (vindred.level >= 8) {
		vindred.addAbility(BloodragePowerFactory.guardedStance(vindred));
	}
	
	if (vindred.level >= 9) {
		vindred.addAbility(FeatFactory.stalwart(vindred));
	}
	
	if (vindred.level >= 11) {
		vindred.addAbility(FeatFactory.improvedStalwart(vindred));
	}
	
	if (vindred.level >= 12) {
		vindred.addAbility(FeatFactory.weaponFocus(vindred, WeaponType.BARDICHE));
		vindred.attributes.charisma.value++;
	}
	
	
	vindred.skillSet.getSkill(SkillsEnum.ACROBATICS).addRank(1);
	vindred.skillSet.getSkill(SkillsEnum.APPRAISE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.BLUFF).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.CLIMB).addRank(1);
	vindred.skillSet.getSkill(SkillsEnum.CRAFT_ALCHEMY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.CRAFT_ARMOR).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.CRAFT_WEAPON).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.DIPLOMACY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.DISABLE_DEVICE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.DISGUISE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.ESCAPE_ARTIST).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.FLY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.HANDLE_ANIMAL).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.HEAL).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.INTIMIDATE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_ARCANA).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_DUNGEONEERING).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_ENGINEERING).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_GEOGRAPHY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_HISTORY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_LOCAL).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_NATURE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_NOBILITY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_PLANES).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_RELIGION).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_MARTIAL).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.LINGUISTICS).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.PERCEPTION).addRank(1);
	vindred.skillSet.getSkill(SkillsEnum.PERFORM_DANCE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.PERFORM_SING).addRank(1);
	vindred.skillSet.getSkill(SkillsEnum.PERFORM_ORATORY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.PROFESSION).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.RIDE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.SENSE_MOTIVE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.SLEIGHT_OF_HAND).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.SPELLCRAFT).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.STEALTH).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.SURVIVAL).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.SWIM).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.USE_MAGIC_DEVICE).addRank(0);
	
	console.log(vindred);
	
	
	myCharacter = vindred;
}


function createSpot(level) {
	if (level == undefined) {
		level = 1;
	}
	var attributes = new Attributes(18, 13, 14, 11, 13, 11);
	var vindred = new Character('bloodrager', attributes, +level, 'equipment');
	
	furiousProperty  = {
	    name : "furious",
		activate : function(weapon) {
			let bloodrage = vindred.getAbilityByName("Bloodrage");
			bonusValue = 2; 
			this.bonus = new Bonus([BonusCategory.TO_HIT, BonusCategory.DAMAGE],  "ENHANCEMENT STACKING", bonusValue, 'Furious');
			bloodrage.properties.add(this.bonus);
		},
		deactivate : function() {
			bloodrage.bonusEffectList.removeAndDeactivate(this.bonus);
		}
	}
	
	vindred.addItem(new Armor('Breastplate Masterwork', ArmorType.BREASTPLATE, undefined, 6, 3, 0, 3, 20, 25, new Bonus(BonusCategory.ARMOR_CLASS, BonusType.ENHANCEMENT, 0, "Breastplate")));
	vindred.addItem(new Weapon('Greataxe +2', WeaponType.GREATAXE, +2, 4, undefined, undefined));
	//vindred.addItem(new Weapon('Greatsword', WeaponType.BARDICHE, +0, 0, undefined, furiousProperty));
	
	
	
	
	vindred.addItem(new Item('Amulet of Natural Armor +1', 'neck', new Bonus(BonusCategory.ARMOR_CLASS, BonusType.NATURAL_ARMOR, 1, "Amulet of Natural Armor +1"), 0));
	vindred.addItem(new Item('Ring of Deflection +1', 'ring', new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DEFLECTION, 1, "Ring of Deflection +1"), 0));
	
	
	
	loadEquipmentFromStorage(vindred);
	
	if (vindred.level >= 3) {
		vindred.addAbility(FeatFactory.powerAttack(vindred));
	}
	
	if (vindred.level >= 5) {
		vindred.addAbility(FeatFactory.furiousFocus(vindred));
	}
	
	if (vindred.level >= 6) {
		vindred.addAbility(FeatFactory.ironWill(vindred));
	}

	
	
	vindred.skillSet.getSkill(SkillsEnum.ACROBATICS).addRank(3);
	vindred.skillSet.getSkill(SkillsEnum.APPRAISE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.BLUFF).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.CLIMB).addRank(1);
	vindred.skillSet.getSkill(SkillsEnum.CRAFT_ALCHEMY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.CRAFT_ARMOR).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.CRAFT_WEAPON).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.DIPLOMACY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.DISABLE_DEVICE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.DISGUISE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.ESCAPE_ARTIST).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.FLY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.HANDLE_ANIMAL).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.HEAL).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.INTIMIDATE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_ARCANA).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_DUNGEONEERING).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_ENGINEERING).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_GEOGRAPHY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_HISTORY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_LOCAL).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_NATURE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_NOBILITY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_PLANES).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_RELIGION).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.KNOWLEDGE_MARTIAL).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.LINGUISTICS).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.PERCEPTION).addRank(1);
	vindred.skillSet.getSkill(SkillsEnum.PERFORM_DANCE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.PERFORM_SING).addRank(1);
	vindred.skillSet.getSkill(SkillsEnum.PERFORM_ORATORY).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.PROFESSION).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.RIDE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.SENSE_MOTIVE).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.SLEIGHT_OF_HAND).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.SPELLCRAFT).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.STEALTH).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.SURVIVAL).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.SWIM).addRank(0);
	vindred.skillSet.getSkill(SkillsEnum.USE_MAGIC_DEVICE).addRank(0);
	
	console.log(vindred);
	
	
	myCharacter = vindred;
}


function createTargalad(level) {
	if (level == undefined) {
		level = 6;
	}
	var attributes = new Attributes(13, 18, 12, 18, 13, 13);
	var targalad = new Character('magus', attributes, +level, 'equipment');
	
	
	targalad.addItem(new Armor('Mithral Chainshirt', ArmorType.CHAINSHIRT, undefined, 4, 6, 0, 0, 20, 20));
	targalad.addItem(new Weapon('BlackBlade Scimitar', WeaponType.SCIMITAR, +2, 4));
	targalad.addItem(new Item('Ring of Deflection +2', 'ring', new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DEFLECTION, 2, "Ring of Deflection +2"), 0));
	targalad.addItem(new Item('Amulet of Natural Armor +1', 'neck', new Bonus(BonusCategory.ARMOR_CLASS, BonusType.NATURAL_ARMOR, 1, "Amulet of Natural Armor +1"), 0));
	
	targalad.addAbility(FeatFactory.weaponFinesse(targalad));
	targalad.addAbility(FeatFactory.dervishDance(targalad));
	targalad.addAbility(FeatFactory.powerAttack(targalad));
	targalad.addAbility(FeatFactory.arcaneStrike(targalad));
	targalad.addAbility(FeatFactory.dodge(targalad));
	
	if (targalad.level >= 3) {
		targalad.characterClass.addArcana(MagusArcanaFactory.blackBladeStrike(targalad));
	}
	
	targalad.skillSet.getSkill(SkillsEnum.ACROBATICS).addRank(3);
	targalad.skillSet.getSkill(SkillsEnum.APPRAISE).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.BLUFF).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.CLIMB).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.CRAFT_ALCHEMY).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.CRAFT_ARMOR).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.CRAFT_WEAPON).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.DIPLOMACY).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.DISABLE_DEVICE).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.DISGUISE).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.ESCAPE_ARTIST).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.FLY).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.HANDLE_ANIMAL).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.HEAL).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.INTIMIDATE).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_ARCANA).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_DUNGEONEERING).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_ENGINEERING).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_GEOGRAPHY).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_HISTORY).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_LOCAL).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_NATURE).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_NOBILITY).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_PLANES).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_RELIGION).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.KNOWLEDGE_MARTIAL).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.LINGUISTICS).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.PERCEPTION).addRank(2);
	targalad.skillSet.getSkill(SkillsEnum.PERFORM_DANCE).addRank(2);
	targalad.skillSet.getSkill(SkillsEnum.PERFORM_SING).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.PERFORM_ORATORY).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.PROFESSION).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.RIDE).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.SENSE_MOTIVE).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.SLEIGHT_OF_HAND).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.SPELLCRAFT).addRank(3);
	targalad.skillSet.getSkill(SkillsEnum.STEALTH).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.SURVIVAL).addRank(0);
	targalad.skillSet.getSkill(SkillsEnum.SWIM).addRank(1);
	targalad.skillSet.getSkill(SkillsEnum.USE_MAGIC_DEVICE).addRank(1);
	
	console.log(targalad);
	
	
	myCharacter = targalad;
}

function createOberon(level) {
	if (level == undefined) {
		level = 7;
	}
	var attributes = new Attributes(11, 18, 16, 14, 10, 10);
	var oberon = new Character('slayer', attributes, +level, 'equipment');
	
	
	oberon.addItem(new Armor('Chainshirt +1', ArmorType.CHAINSHIRT, undefined, 4, 4, 0, 1, 20, 20));
	oberon.addItem(new Weapon('Composite Longbow +1', WeaponType.LONGBOW, 1, 4));
	oberon.addItem(new Item('Ring of Deflection +2', 'ring', new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DEFLECTION, 1, "Ring of Deflection +1"), 0));
	oberon.addItem(new Item('Amulet of Natural Armor +0', 'neck', new Bonus(BonusCategory.ARMOR_CLASS, BonusType.NATURAL_ARMOR, 1, "Amulet of Natural Armor +0"), 0));
	
	oberon.removeAbility("Flank");
	oberon.removeAbility("Charge");
	
	if (oberon.level >= 3) {
		oberon.addAbility(FeatFactory.pointBlankShot(oberon));
	}
	
	if (oberon.level >= 3) {
		oberon.addAbility(FeatFactory.rapidShot(oberon));
	}
	
	if (oberon.level >= 5) {
		oberon.addAbility(FeatFactory.masterSniper(oberon));
	}
	
	oberon.skillSet.getSkill(SkillsEnum.ACROBATICS).addRank(3);
	oberon.skillSet.getSkill(SkillsEnum.APPRAISE).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.BLUFF).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.CLIMB).addRank(1);
	oberon.skillSet.getSkill(SkillsEnum.CRAFT_ALCHEMY).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.CRAFT_ARMOR).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.CRAFT_WEAPON).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.DIPLOMACY).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.DISABLE_DEVICE).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.DISGUISE).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.ESCAPE_ARTIST).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.FLY).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.HANDLE_ANIMAL).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.HEAL).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.INTIMIDATE).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.KNOWLEDGE_ARCANA).addRank(1);
	oberon.skillSet.getSkill(SkillsEnum.KNOWLEDGE_DUNGEONEERING).addRank(1);
	oberon.skillSet.getSkill(SkillsEnum.KNOWLEDGE_ENGINEERING).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.KNOWLEDGE_GEOGRAPHY).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.KNOWLEDGE_HISTORY).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.KNOWLEDGE_LOCAL).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.KNOWLEDGE_NATURE).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.KNOWLEDGE_NOBILITY).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.KNOWLEDGE_PLANES).addRank(1);
	oberon.skillSet.getSkill(SkillsEnum.KNOWLEDGE_RELIGION).addRank(1);
	oberon.skillSet.getSkill(SkillsEnum.KNOWLEDGE_MARTIAL).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.LINGUISTICS).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.PERCEPTION).addRank(2);
	oberon.skillSet.getSkill(SkillsEnum.PERFORM_DANCE).addRank(2);
	oberon.skillSet.getSkill(SkillsEnum.PERFORM_SING).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.PERFORM_ORATORY).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.PROFESSION).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.RIDE).addRank(1);
	oberon.skillSet.getSkill(SkillsEnum.SENSE_MOTIVE).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.SLEIGHT_OF_HAND).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.SPELLCRAFT).addRank(3);
	oberon.skillSet.getSkill(SkillsEnum.STEALTH).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.SURVIVAL).addRank(0);
	oberon.skillSet.getSkill(SkillsEnum.SWIM).addRank(1);
	oberon.skillSet.getSkill(SkillsEnum.USE_MAGIC_DEVICE).addRank(1);
	
	console.log(oberon);
	
	
	myCharacter = oberon;
}

function createAzax(level) {
	if (level == undefined) {
		level = 7;
	}
	var attributes = new Attributes(18, 16, 16, 14, 14, 10);
	var azax = new Character('hunter', attributes, +level, 'equipment');
	
	
	azax.addItem(new Armor('Studded Leather', ArmorType.STUDDED_LEATHER, undefined, 3, 4, 0, 0, 20, 20));
	azax.addItem(new Weapon('Masterwork Scimitar', WeaponType.SCIMITAR, "MASTERWORK", 4));
	azax.equipment.addSecondWeapon(new Weapon('Kukri', WeaponType.KUKRI, "MASTERWORK", 4));
	azax.addItem(new Item('Ring of Deflection +1', 'ring', new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DEFLECTION, 1, "Ring of Deflection +1"), 0));
	//azax.addItem(new Item('Amulet of Natural Armor +0', 'neck', new Bonus(BonusCategory.ARMOR_CLASS, BonusType.NATURAL_ARMOR, 1, "Amulet of Natural Armor +0"), 0));
	

	if (azax.level >= 1) {
		azax.addAbility(FeatFactory.twoWeaponFighting(azax));
	}
	
	if (azax.level >= 3) {
		azax.addAbility(FeatFactory.outflank(azax));
	}
	
	if (azax.level >= 7) {
		//azax.addAbility(FeatFactory.twoWeaponRend(azax));
	}
	
	
	azax.animalCompanion = "animal-companion-griffin";
	azax.skillSet.getSkill(SkillsEnum.ACROBATICS).addRank(3);
	azax.skillSet.getSkill(SkillsEnum.APPRAISE).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.BLUFF).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.CLIMB).addRank(1);
	azax.skillSet.getSkill(SkillsEnum.CRAFT_ALCHEMY).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.CRAFT_ARMOR).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.CRAFT_WEAPON).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.DIPLOMACY).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.DISABLE_DEVICE).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.DISGUISE).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.ESCAPE_ARTIST).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.FLY).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.HANDLE_ANIMAL).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.HEAL).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.INTIMIDATE).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.KNOWLEDGE_ARCANA).addRank(1);
	azax.skillSet.getSkill(SkillsEnum.KNOWLEDGE_DUNGEONEERING).addRank(1);
	azax.skillSet.getSkill(SkillsEnum.KNOWLEDGE_ENGINEERING).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.KNOWLEDGE_GEOGRAPHY).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.KNOWLEDGE_HISTORY).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.KNOWLEDGE_LOCAL).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.KNOWLEDGE_NATURE).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.KNOWLEDGE_NOBILITY).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.KNOWLEDGE_PLANES).addRank(1);
	azax.skillSet.getSkill(SkillsEnum.KNOWLEDGE_RELIGION).addRank(1);
	azax.skillSet.getSkill(SkillsEnum.KNOWLEDGE_MARTIAL).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.LINGUISTICS).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.PERCEPTION).addRank(2);
	azax.skillSet.getSkill(SkillsEnum.PERFORM_DANCE).addRank(2);
	azax.skillSet.getSkill(SkillsEnum.PERFORM_SING).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.PERFORM_ORATORY).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.PROFESSION).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.RIDE).addRank(1);
	azax.skillSet.getSkill(SkillsEnum.SENSE_MOTIVE).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.SLEIGHT_OF_HAND).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.SPELLCRAFT).addRank(3);
	azax.skillSet.getSkill(SkillsEnum.STEALTH).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.SURVIVAL).addRank(0);
	azax.skillSet.getSkill(SkillsEnum.SWIM).addRank(1);
	azax.skillSet.getSkill(SkillsEnum.USE_MAGIC_DEVICE).addRank(1);
	
	console.log(azax);
	
	
	myCharacter = azax;
}

function Character(characterClass, attributes, level, equipment) {
	//properties
	this.attributes = attributes;
	this.level = level;
	this.characterClass = characterClass;
	
	
	this.equipment = new Equipment(this);
	
	this.nonPassiveAbilities = [];
	this.passiveAbilities = [];
	this.conditionEffects = {};
	
	
	
	
	
	this.getMaxArcanePool = function() {
		return this.attributes.intelligence.getModifier() + Math.floor(this.level * 0.5);
	};
	
	this.currentArcanePool = this.getMaxArcanePool();
	
	
	
	this.addItem = function(item) {
		this.equipment.addItem(item);
	};
	
	this.addAbility = function(ability) {
		ability.setOwner(this);
		if (ability.actionType == ActionType.PASSIVE) {
			this.passiveAbilities.push(ability);
		} else {
			this.nonPassiveAbilities.push(ability);
		}
		
	};
	
	this.getHD = function() {
		if (this.hd == null) {
			return this.level;
		} else {
			return this.hd;
		}
	}
	
	this.removeAbility = function(abilityName) {
		let index = this.nonPassiveAbilities.findIndex(ability => ability.name == abilityName);
		if (index >= 0) {
			this.nonPassiveAbilities.splice(index, 1);
		}
		index = this.passiveAbilities.findIndex(ability => ability.name == abilityName);
		if (index >= 0) {
			this.passiveAbilities.splice(index, 1);
		}
		
	};
	
	if (characterClass == 'magus') {
		this.characterClass = new Magus(this);
	}
	if (characterClass == 'bloodrager') {
		this.characterClass = new Bloodrager(this);
	}
	if (characterClass == 'hunter') {
		this.characterClass = new Hunter(this);
	}
	if (characterClass == 'slayer') {
		this.characterClass = new Slayer(this);
	}
	if (characterClass == 'animal-companion') {
		this.characterClass = new AnimalCompanion(this);
	}
	this.saves = this.characterClass.saves;
	this.getBab = function() {
		return this.characterClass.getBab(this.level);
	};
	
	this.defense = new Defense(this);
	this.offense = new Offense(this);
	
	
	
	this.skillSet = new SkillSet(this);
	
	this.deactivateAbilitiesByAction = function(actionType) {
		for (var i = 0; i < this.nonPassiveAbilities.length; i++) {
			var ability = this.nonPassiveAbilities[i];
			if (ability.actionType == actionType && ability.active) {
				ability.deactivate();
			}
		}
		
	};
	
	this.deactivateAbility = function(abilityId) {
		for (var i = 0; i < this.nonPassiveAbilities.length; i++) {
			var ability = this.nonPassiveAbilities[i];
			if (ability.id == abilityId && ability.active) {
				ability.deactivate();
			}
		}
		
	};
	
	this.addCondition = function(conditionEffect) {
		this.conditionEffects[conditionEffect.name] = conditionEffect;
	};
	
	this.removeCondition = function(conditionEffect) {
		delete this.conditionEffects[conditionEffect.name];
	};
	
	this.getConditions = function() {
		return Utils.mapToArray(this.conditionEffects);
	};
	
	this.getCondition = function(conditionName) {
		for (let conditionEffectId in this.conditionEffects) {
			if (this.conditionEffects[conditionEffectId].name === conditionName) {
				return this.conditionEffects[conditionEffectId];
			}
		}
	};
	
	
	for (var i in AbilityFactory) {
		this.addAbility(AbilityFactory[i](this));
	}
	
	var classAbilities = this.characterClass.getAllAbilities();
	for(i = 0; i < classAbilities.length; i++) {
		this.addAbility(classAbilities[i]);
	}
	
	this.getAbilityByName = function(name) {
		for (let i = 0; i < this.nonPassiveAbilities.length; i++) {
			if (this.nonPassiveAbilities[i].name === name) {
				return this.nonPassiveAbilities[i];
			}
		}
		for (let i = 0; i < this.passiveAbilities.length; i++) {
			if (this.passiveAbilities[i].name === name) {
				return this.passiveAbilities[i];
			}
		}
	}
	
	this.getSpellBook = function() {
		return this.characterClass.spellbook;
	};
	
	this.getMemorizedSpells = function() {
		return this.characterClass.memorizedSpells;
	};
	
	this.getDescriptionAbilities = function() {
		let descriptionAbilities = [];
		for (let i = 0; i < this.passiveAbilities.length; i++) {
			if (this.passiveAbilities[i].description != null && this.passiveAbilities[i].description != undefined) {
				descriptionAbilities.push(this.passiveAbilities[i]);
			}
		}
		return descriptionAbilities;
	};
	
	this.refreshBlockers = 0;
	
	this.blockRefresh = function() {
		this.refreshBlockers++;
	}
	
	this.deBlockRefresh = function() {
		this.refreshBlockers--;
	}
	
	this.refresh = function() {		
		if (this.refreshBlockers > 0) {
			return;
		}
		
		console.log("refresh");
		this.attributes.strength.getValue();
		this.attributes.dexterity.getValue();
		this.attributes.constitution.getValue();
		this.attributes.intelligence.getValue();
		this.attributes.wisdom.getValue();
		this.attributes.charisma.getValue();
		
		this.saves.fort.getValue();
		this.saves.reflex.getValue();
		this.saves.will.getValue();
		
		this.offense.getAttacks().forEach((attack) => {
			attack.getToHit();
			attack.getDmg();
		});
		this.offense.attackOfOpportunity.getToHit();
		this.offense.attackOfOpportunity.getDmg();
		
		this.offense.getCmb();
		this.offense.getCmbWeapon();
		
		this.defense.getArmorClass();
		this.defense.getTouchAc();
		this.defense.getFlatFootedAc();
		
		this.defense.getCmd();
	};
	
	addModelListener("REFRESH", (e) => {
		this.blockRefresh();
		setTimeout(() => {
			this.deBlockRefresh();
			this.refresh();
		},0);
		
	});
}
