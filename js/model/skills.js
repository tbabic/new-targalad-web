SkillsEnum = {
	ACROBATICS:"Acrobatics",
	APPRAISE:"Appraise",
	BLUFF:"Bluff",
	CLIMB:"Climb",
	CRAFT_ALCHEMY:"Craft (alchemy)",
	CRAFT_ARMOR:"Craft (armor)",
	CRAFT_WEAPON:"Craft (weapon)",
	DIPLOMACY:"Diplomacy",
	DISABLE_DEVICE:"Disable Device",
	DISGUISE:"Disguise",
	ESCAPE_ARTIST:"Escape Artist",
	FLY:"Fly",
	HANDLE_ANIMAL:"Handle Animal",
	HEAL:"Heal",
	INTIMIDATE:"Intimidate",
	KNOWLEDGE_ARCANA:"Knowledge (arcana)",
	KNOWLEDGE_DUNGEONEERING:"Knowledge (dungeoneering)",
	KNOWLEDGE_ENGINEERING:"Knowledge (engineering)",
	KNOWLEDGE_GEOGRAPHY:"Knowledge (geography)",
	KNOWLEDGE_HISTORY:"Knowledge (history)",
	KNOWLEDGE_LOCAL:"Knowledge (local)",
	KNOWLEDGE_NATURE:"Knowledge (nature)",
	KNOWLEDGE_NOBILITY:"Knowledge (nobility)",
	KNOWLEDGE_PLANES:"Knowledge (planes)",
	KNOWLEDGE_RELIGION:"Knowledge (religion)",
	KNOWLEDGE_MARTIAL:"Knowledge (martial)",
	LINGUISTICS:"Linguistics",
	PERCEPTION:"Perception",
	PERFORM_DANCE:"Perform (dance)",
	PERFORM_SING:"Perform (oratory)",
	PERFORM_ORATORY:"Perform (sing)",
	PROFESSION:"Profession",
	RIDE:"Ride",
	SENSE_MOTIVE:"Sense Motive",
	SLEIGHT_OF_HAND:"Sleight of Hand",
	SPELLCRAFT:"Spellcraft",
	STEALTH:"Stealth",
	SURVIVAL:"Survival",
	SWIM:"Swim",
	USE_MAGIC_DEVICE:"Use Magic Device",

	properties: {
		"Acrobatics" : { untrained: true,armorCheckPenalty:true, attribute:"DEXTERITY"},
		"Appraise" : { untrained: true,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Bluff" : { untrained: true,armorCheckPenalty:false, attribute:"CHARISMA"},
		"Climb" : { untrained: true,armorCheckPenalty:true, attribute:"STRENGTH"},
		"Craft (alchemy)" : { untrained: true,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Craft (armor)" : { untrained: true,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Craft (weapon)" : { untrained: true,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Diplomacy" : { untrained: true,armorCheckPenalty:false, attribute:"CHARISMA"},
		"Disable Device" : { untrained: true,armorCheckPenalty:true, attribute:"DEXTERITY"},
		"Disguise" : { untrained: true,armorCheckPenalty:false, attribute:"CHARISMA"},
		"Escape Artist" : { untrained: false,armorCheckPenalty:true, attribute:"DEXTERITY"},
		"Fly" : { untrained: true,armorCheckPenalty:true, attribute:"DEXTERITY"},
		"Handle Animal" : { untrained: true,armorCheckPenalty:false, attribute:"CHARISMA"},
		"Heal" : { untrained: true,armorCheckPenalty:false, attribute:"WISDOM"},
		"Intimidate" : { untrained: true,armorCheckPenalty:false, attribute:"CHARISMA"},
		"Knowledge (arcana)" : { untrained: false,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Knowledge (dungeoneering)" : { untrained: false,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Knowledge (engineering)" : { untrained: false,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Knowledge (geography)" : { untrained: false,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Knowledge (history)" : { untrained: true,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Knowledge (local)" : { untrained: false,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Knowledge (nature)" : { untrained: false,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Knowledge (nobility)" : { untrained: false,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Knowledge (planes)" : { untrained: false,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Knowledge (religion)" : { untrained: false,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Knowledge (martial)" : { untrained: false,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Linguistics" : { untrained: false,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Perception" : { untrained: true,armorCheckPenalty:false, attribute:"WISDOM"},
		"Perform (dance)" : { untrained: true,armorCheckPenalty:false, attribute:"CHARISMA"},
		"Perform (oratory)" : { untrained: true,armorCheckPenalty:false, attribute:"CHARISMA"},
		"Perform (sing)" : { untrained: true,armorCheckPenalty:false, attribute:"CHARISMA"},
		"Profession" : { untrained: false,armorCheckPenalty:false, attribute:"WISDOM"},
		"Ride" : { untrained: true,armorCheckPenalty:true, attribute:"DEXTERITY"},
		"Sense Motive" : { untrained: true,armorCheckPenalty:false, attribute:"WISDOM"},
		"Sleight of Hand" : { untrained: false,armorCheckPenalty:true, attribute:"DEXTERITY"},
		"Spellcraft" : { untrained: false,armorCheckPenalty:false, attribute:"INTELLIGENCE"},
		"Stealth" : { untrained: true,armorCheckPenalty:true, attribute:"DEXTERITY"},
		"Survival" : { untrained: true,armorCheckPenalty:false, attribute:"WISDOM"},
		"Swim" : { untrained: true,armorCheckPenalty:true, attribute:"STRENGTH"},
		"Use Magic Device" : { untrained: false,armorCheckPenalty:false, attribute:"CHARISMA"}
	},
	
	listAll : function() {
		var _list = [];
		for (var i in this) {
			if (Utils.isString(this[i])) {
				_list.push(this[i]);
			}
			
		}
		return _list;
	},
	
	acpSkills : function() {
		var _list = [];
		for (var i in this) {
			var skillName = this[i];
			if (this.properties[skillName].armorCheckPenalty) {
				_list.push(this[i]);
			}
		}
		return _list;
	}
};



function Skill(skillName, character) {
	this.name = skillName;
	this.untrained = SkillsEnum.properties[skillName].untrained;
	this.armorCheckPenalty = SkillsEnum.properties[skillName].armorCheckPenalty;
	this.isClassSkill = false;
	if (character !== undefined) {
		this.isClassSkill = character.characterClass.classSkills.indexOf(skillName) > -1;
	}
	this.ranks = 0;
	this.bonusProcessor = new BonusProcessor();
	this.attribute = character.attributes.getAttribute(SkillsEnum.properties[skillName].attribute);
	this.armor = undefined;
	if (character !== undefined && character.equipment !== undefined) {
		this.armor = character.equipment.armor;
	}
	
	this.canBeUsedUntrained = function() {
		return SkillsEnum.properties[skillName].untrained;
	};
	
	this.appliesArmorCheckPenalty = function() {
		return SkillsEnum.properties[skillName].armorCheckPenalty;
	};
	
	this.getArmorCheckPenalty = function() {
		if (this.armor !== undefined) {
			return this.armor.armorCheckPenalty;
		} else {
			return 0;
		}
	};

	this.addRank = function(value) {
		if (value !== undefined) {
			this.ranks += +value;
		} else {
			this.ranks++;
		}
	};
	
	this.getClassSkillBonus = function() {
		return (this.isClassSkill && this.ranks) ? 3 : 0;
	};
	
	this.getValue = function() {
		if (!this.untrained && this.ranks === 0) {
			return "*";
		}
		var classSkillBonus = this.getClassSkillBonus();
		return classSkillBonus + this.ranks + this.bonusProcessor.getValue() + this.attribute.getModifier() - this.getArmorCheckPenalty();
	};
	
	
	
	this.getAttributeModifier = function(){
		return this.attribute.getModifier();
	};
	
	addModelListener(skillName, (e, bonusEffect) => {
		this.bonusProcessor.processBonusEffect(bonusEffect);
	});
	
	addModelListener("ARMOR", "ADDED", (e, armor) => {
		this.armor = armor;
	});
	
	addModelListener("ARMOR", "REMOVED", (e, armor) => {
		if (this.armor !== undefined && this.armor.id == armor.id) {
			this.armor = undefined;
		}
	});
}

function SkillSet(character) {
	let classSkills = character.characterClass.classSkills;
	let skillsEnumAll = SkillsEnum.listAll();
	this.skills = {};
	for (let i = 0; i< skillsEnumAll.length; i++) {
		let skillEnum = skillsEnumAll[i];

		this.skills[skillEnum] = new Skill(skillEnum, character);
	}
	
	this.getSkillsList = function() {
		let skillList = [];
		for (let skillName in this.skills) {
			skillList.push(this.skills[skillName]);
		}
		return skillList;
	};
	
	this.getSkill = function(skillName) {
		return this.skills[skillName];
	};
}
