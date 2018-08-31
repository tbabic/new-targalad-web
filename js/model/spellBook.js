function SpellBook(character, pages, weight) {
	this.character = character;
	this.pages = pages;
	this.weight = weight;
	this.spells={};
	
	this.extendSpellbook = function(pages, weight) {
		this.pages += pages;
		this.weight += weight;
	};
	
	this.addSpell = function(spell) {
		if(this.pagesPerSpell(spell) > this.getAvailablePages()) {
			throw ("not enough pages in spellbook");	
		}
		this.spells[spell.id] = spell;
	};
	
	this.deleteSpell = function(spell) {
		if (this.containsSpell(spell)) {
			delete this.spells[spell.id];
		}
	};
	
	this.getAvailablePages = function() {
		var minPagePerSpell = 1;
		var takenPages = 0;
		for (var id in this.spells) {
			takenPages += this.pagesPerSpell(this.spells[id]);
		}
		return this.pages - takenPages;
	};
	
	this.pagesPerSpell = function(spell) {
		var minPagePerSpell = 1;
		var pagePerSpell = (minPagePerSpell > spell.level) ? minPagePerSpell : spell.level;
	};
	
	this.containsSpell = function(spell) {
		return this.spells[spell.id] !== undefined;
	};
	
	this.getKnownSpellsList = function() {
		let known = [];
		for (var id in this.spells) {
			known.push(this.spells[id]);
		}
		return known;
	};
}





function Spell(id, name, level, spellLevel, school, castingTime,
		components, range, area, effect, target, duration, 
		savingThrow, spellResistance, description,
		propertiesOrCallback, activateOrDeactivateCallback, deactivateCallback) {
	this.id = id;
	this.name = name;
	this.level = level;
	this.spellLevel = spellLevel;
	this.school = school;
	this.castingTime = castingTime;
	this.components = components;
	this.range = range;
	this.area = area;
	this.effect = effect;
	this.target = target;
	this.duration = duration;
	this.savingThrow = savingThrow;
	this.spellResistance = spellResistance;
	this.description = description;
	this.properties = new BonusEffectList(this);
	if (propertiesOrCallback instanceof Function) {
		this.activateCallback = propertiesOrCallback;
		this.deactivateCallback = activateOrDeactivateCallback;
	} else {
		if(propertiesOrCallback !== undefined) {
			this.properties.add(propertiesOrCallback);
		}
		this.activateCallback = activateOrDeactivateCallback;
		this.deactivateCallback = deactivateCallback;
	}
	
	
	this.activate = function(params) {
		this.properties.activate(this);
		if (this.activateCallback !== undefined) {
			this.activateCallback(params);
		}
	};
	
	this.deactivate = function(params) {
		this.properties.deactivate(this);
		if (this.deactivateCallback !== undefined) {
			this.deactivateCallback(params);
		}
	};
	
	this.isLearned = function(byCharacter) {
		let spellbook = byCharacter.getSpellBook();
		if (spellbook === undefined) {
			return false;
		}
		return spellbook.containsSpell(this);
	};
	
	this.isMemorized = function(byCharacter) {
		let memorizedSpells = byCharacter.getMemorizedSpells();
		if (memorizedSpells === undefined) {
			return false;
		}
		return memorizedSpells.contains(this);
	};
	
	this.memorizedCount = function(byCharacter) {
		let memorizedSpells = byCharacter.getMemorizedSpells();
		if (memorizedSpells === undefined) {
			return false;
		}
		return memorizedSpells.memorizationCount(this);
	};
	
	this.canBeCast = function(byCharacter) {
		let memorizedSpells = byCharacter.getMemorizedSpells();
		if (memorizedSpells === undefined) {
			return false;
		}
		return memorizedSpells.canBeCast(this);
	};
	
}

function MemorizedSpells(character) {
	this.character = character;
	this.memorized = {0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{},9:{}};
	
	this.reset = function() {
		this.memorized = {0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{},9:{}};
	};
	
	this.getSpellsByLevel = function(level) {
		if (this.memorized[level] === undefined) {
			this.memorized[level] = {};
		}
		return this.memorized[level];
	};
	
	this.getExistingSpell = function(spell) {
		spell = new MemorizedSpell(spell);
		let memorizedSpellsByLevel = this.getSpellsByLevel(spell.getLevel());
		let existingSpell = memorizedSpellsByLevel[spell.getId()];
		return existingSpell !== undefined ? existingSpell : null;
	};
	
	this.contains = function(spell){
		let existingSpell = this.getExistingSpell(spell);
		if (existingSpell === null) {
			return false;
		}
		return true;
	};
	
	this.memorizationCount = function(spell) {
		let existingSpell = this.getExistingSpell(spell);
		if (existingSpell === null) {
			return 0;
		} else {
			return existingSpell.count;
		}
	}
	
	this.getSpellLevel=function(spell) {
		if (spell instanceof Spell)  {
			return spell.level;
		} else if (spell instanceof MemorizedSpell) {
			return spell.getLevel();
		}
		console.error("spell is not an instance of Spell or MemorizedSpell", spell);
		return null;
	};
	
	this.hasCapacity = function(spellOrSpellLevel) {
		let spellLevel = spellOrSpellLevel;
		if (!Number.isInteger(spellOrSpellLevel)) {
			spellLevel = this.getSpellLevel(spellOrSpellLevel);
		}
		return this.size(spellLevel) < this.capacity(spellLevel);		
	};

	this.add = function(spell) {
		if (!this.hasCapacity(spell)) {
			return;
		}
		let existingSpell = this.getExistingSpell(spell);
		if (existingSpell === null) {
			existingSpell = new MemorizedSpell(spell);
			this.memorized[existingSpell.getLevel()][existingSpell.getId()] = existingSpell;
		} else {
			existingSpell.count++;
		}
	};
	
	this.remove = function(spell) {
		let existingSpell = this.getExistingSpell(spell);
		if (existingSpell === null) {
			return 0;
		}
		existingSpell.count--;
		if (existingSpell.count === 0 ) {
			let memorizedByLevel = this.memorized[existingSpell.getLevel()];
			delete memorizedByLevel[existingSpell.getId()];
		}
	};
	
	this.canBeCast = function(spell) {
		let existingSpell = this.getExistingSpell(spell);
		if (existingSpell === null) {
			return false;
		}
		return existingSpell.canBeCast();
	};
	
	this.cast = function(spell) {
		if (this.canBeCast(spell)) {
			existingSpell.castCount++;
		}
	};
	
	this.canBeRecalled = function(spell) {
		let existingSpell = this.getExistingSpell(spell);
		if (existingSpell === null) {
			return false;
		}
		return existingSpell.canBeRecalled();
	};
	
	this.recall = function(spell) {
		if (this.canBeRecalled(spell)) {
			existingSpell.castCount--;
		}
	};
	
	this.size = function(spellLevel) {
		if (spellLevel === undefined) {
			spellLevel = 0;
		}
		let memorizedSpellsByLevel = this.getSpellsByLevel(spellLevel);
		let count = 0;
		for (let spellId in memorizedSpellsByLevel) {
			count += memorizedSpellsByLevel[spellId].count;
		}
		return count;
	};
	
	this.capacity = function(spellLevel) {
		if (spellLevel === undefined) {
			spellLevel = 0;
		}
		return this.character.characterClass.spellsPerDay(spellLevel);
	};
		
}

function MemorizedSpell(spell) {
	if (spell instanceof Spell) {
		this.spell = spell;
		this.count = 1;
		this.castCount = 0;
	} else if (spell instanceof MemorizedSpell) {
		this.spell = spell.spell;
		this.count = spell.count;
		this.castCount = spell.castCount;
	} else {
		throw ["spell is not an instance of Spell or MemorizedSpell", spell];
	}
	
	
	
	this.canBeRecalled = function() {
		return this.castCount > 0;
	};
	
	this.canBeCast = function() {
		return this.count > this.castCount;
	};
	
	
	this.getLevel = function() {
		return spell.level;
	};
	
	this.getId = function() {
		return spell.id;
	};
	
	this.getName = function() {
		return spell.name;
	};
	
	
}


