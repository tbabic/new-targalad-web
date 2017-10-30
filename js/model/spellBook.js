function SpellBook(character, pages, weight) {
	this.character = spellBook;
	this.pages = pages;
	this.weight;
	this.spells=[];
	
	function extendSpellbook(pages, weight) {
		this.pages += pages;
		this.weight += weight;
	}
	
	function addSpell(spell) {
		if(pagesPerSpell(spell) > getAvailablePages()) {
			throw new Exception("not enough pages in spellbook");	
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

function Spell(id, name, level) {
	this.id = id;
	this.name = name;
	this.level = level;
}


