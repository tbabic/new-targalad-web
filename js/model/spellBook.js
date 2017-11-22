function SpellBook(character, pages, weight) {
	this.character = spellBook;
	this.pages = pages;
	this.weight = weight;
	this.spells=[];
	
	function extendSpellbook(pages, weight) {
		this.pages += pages;
		this.weight += weight;
	}
	
	function addSpell(spell) {
		if(pagesPerSpell(spell) > getAvailablePages()) {
			throw ("not enough pages in spellbook");	
		}
		this.spells.push(spell);
		
	}
	
	function getAvailablePages() {
		var minPagePerSpell = 1;
		var takenPages = 0;
		for (var i = 0; i < spellLevels.length; i++) {
			takenPages += pagesPerSpell(spells[i]);
		}
		return this.pages - takenPages;
	}
	
	function pagesPerSpell(spell) {
		var minPagePerSpell = 1;
		var pagePerSpell = (minPagePerSpell > spell.level) ? minPagePerSpell : spell.level;
	}
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

}


