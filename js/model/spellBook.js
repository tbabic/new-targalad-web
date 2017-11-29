function SpellBook(character, pages, weight) {
	this.character = character;
	this.pages = pages;
	this.weight = weight;
	this.spells={};
	this.memorized={};
	
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
	
	this.getMemorizedCount = function(spellLevel) {
		var count = 0;
		for (var spellId in this.memorized) {
			if (this.memorized.getLevel() === spellLevel) {
				count += this.memorized.count;
			}
		}
		return count;
	};
	
	this.canBeMemorized = function(spell) {
		var memorizedCount = this.getMemorizedCount(spell.level);
		var maximumMemorized = this.character.characterClass.getSpellsPerDay(spell.level);
		if (maximumMemorized === undefined) {
			return false;
		}
		return memorizedCount < maximumMemorized;
	};
	
	this.memorize = function(spell) {
		if (!this.canBeMemorized()) {
			return;
		}
		if (isSpellMemorized(spell)) {
			this.memorized[spell.id].count++;
		} else {
			this.memorized[spell.id] = new MemorizedSpell(spell);
		}
	};
	
	this.isSpellMemorized = function(spell) {
		return this.memorized[spell.id] !== undefined;
	};
	
	this.canBeCast = function(spell) {
		return this.isSpellMemorized(spell) && this.memorized[spell.id].canBeCast();
	};
	
	this.castSpell = function(spell) {
		if (this.canBeCast(spell)) {
			this.memorized[spell.id].cast();
		}
	};
	
	this.recallSpell = function(spell) {
		if (this.isSpellMemorized(spell)) {
			this.memorized[spell.id].count++;
		}
	};
	
	this.resetMemorized = function() {
		for (var spellId in this.memorized) {
			delete this.memorized[spellId];
		}
	};
	
	this.getKnownSpellsList = function() {
		let known = [];
		for (var id in this.spells) {
			known.push(this.spells[id]);
		}
		return known;
	};
	
	this.getMemorizedSpellsList = function() {
		let list = [];
		for (var id in this.memorized) {
			if (this.isSpellMemorized(this.spells[id])) {
				list.push(this.spells[id]);
			}	
		}
		return list;
	};
	
	this.getCastableSpellsList = function() {
		let list = [];
		for (var id in this.memorized) {
			if (this.canBeCast(this.spells[id])) {
				list.push(this.spells[id]);
			}
			
		}
		return list;
	};
}



function Spell(id, name, level, propertiesOrCallback, activateOrDeactivateCallback, deactivateCallback) {
	this.id = id;
	this.name = name;
	this.level = level;
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
		let spellbook = byCharacter.getSpellBook();
		if (spellbook === undefined) {
			return false;
		}
		return spellbook.isSpellMemorized(this);
	};
	
	this.canBeCast = function(byCharacter) {
		let spellbook = byCharacter.getSpellBook();
		if (spellbook === undefined) {
			return false;
		}
		return spellbook.canBeCast(this);
	};
	
}

function MemorizedSpell(spell) {
	this.spell = spell;
	this.count = 1;
	this.cast = false;
	
	this.memorizeAgain = function() {
		this.count++;
	};
	
	this.cast = function(params) {
		if (this.count === 0 ) {
			return;
		}
		this.spell.activate(params);
		this.count--;
		this.cast = true;
	};
	
	this.canBeRecalled = function() {
		return this.cast;
	};
	
	this.canBeCast = function() {
		return this.count > 0;
	};
	
	this.recall = function() {
		if (this.canBeRecalled()) {
			this.count++;
		}
	};
	
	this.getLevel = function() {
		return spell.level;
	};
	
	
}


