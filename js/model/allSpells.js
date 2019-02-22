var allSpells = [];
console.log("loading spells");
var loadSpells = function() {
	let finished = false;
	let url = "https://docs.google.com/spreadsheets/export?id=1cuwb3QSvWDD7GG5McdvyyRBpqycYuKMRsXgyrvxvLFI&exportFormat=csv";
	$.ajax({url: url, async:false, success: function(response) {
		console.log("spells loaded");
		Papa.parse(response, {
			delimiter: ",",
			newline:"\n",
			header: true,
			dynamicTyping: true,
			complete: function(results) {
				
				results.data.sort(function(a,b) {
					if (a.magus === "NULL" && b.magus === "NULL") {
						return 0;
					}
					if (a.magus === "NULL") {
						return 1;
					}
					if (b.magus === "NULL") {
						return -1;
					}
					
					if (a.magus == b.magus) {
						if (a.name < b.name) {
							return -1;
						}
						if (a.name > b.name) {
							return 1;
						}
						return 0;
					}
					return a.magus-b.magus;
					
				});
//				console.log(results.data);
				for (let i = 0; i < results.data.length; i++) {
					let row = results.data[i];
					if (row.magus === "NULL") {
						continue;
					}
					let spell = new Spell(i, row.name, row.magus, row.spell_level, row.school,
							row.casting_time, row.components, row.range, row.area, row.effect, 
							row.targets, row.duration, row.saving_throw, row.spell_resistence,
							row.description_formated);
					allSpells.push(spell);
						
				}
				console.log("spells processed");
				finished = true;
			},
			error: function(err) {
				console.log("error parsing data");
				console.log(err);
			}});
	}});
}();

var SpellsDB = function(spellsList) {
	this.byId = {};
	this.byLevel = {};
	
	for(let i = 0; i< spellsList.length; i++) {
		let spell = spellsList[i];
		this.byId[spell.id] = spell;
		if(this.byLevel[spell.level] === undefined) {
			this.byLevel[spell.level] = {};
		}
		let byLevel = this.byLevel[spell.level];
		byLevel[spell.id] = spell;
	}
	
	this.getById=function(id) {
		return this.byId[id];
	};
	
	this.getByLevelAndId=function(level, id) {
		return this.byLevel[level][id];
	};
	
	this.getByLevel = function(level) {
		return this.byLevel[level];
	};
};
//
var spellsDB = new SpellsDB(allSpells);