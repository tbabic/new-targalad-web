attrBonus = function(value) {
	return Math.floor((value-10)/2);
}

function defense (character) {
	var dex = character.attributes.getBonus('dexterity');
	var dexAc = dex;
	var str = character.attributes.getBonus('strength')
	if (character.equipment.armor) {
		if (dexAc > armor.maxDexBonus) {
			dexAc = armor.maxDexBonus;
		}
	}
	
    this.character = character;
	this.armorClass = 10 + dexAc;
    this.touchAC = 10 + dexAc;
    this.flatfooted = 10;
    this.baseCmd = 10 + character.getBab() + str + dex;
    this.baseCmdFlat = 10 + character.getBab() + str;
	
	this.bonusList = {
		deflection: acBonus(nonstackingBonus, true, true, true),
		armor:  acBonus(nonstackingBonus,false, true, false),
		natural:  acBonus(nonstackingBonus,false, true, false),
		shield:  acBonus(nonstackingBonus,true, true, false),
		luck:  acBonus(nonstackingBonus,true, true, true),
		insight:  acBonus(nonstackingBonus,true, true, true),
		morale:  acBonus(nonstackingBonus,true, true, true),
		profane:  acBonus(nonstackingBonus,true, true, true),
		sacred:  acBonus(nonstackingBonus,true, true, true),
		dodge:  acBonus(stackingBonus,true, false, true),
		untyped:  acBonus(stackingBonus,true, true, true)
	}


	this.calculate = function() {

		for (var slot in character.equipment) {
			var item = character.equipment[slot];
			for (var property in item) {
				if (property.category == 'defense' || property.category == 'armorClass') {
					if(this.bonusList.hasOwnProperty(property.bonusType)) {
						this.bonusList[property.bonusType].add(property.value);
					}
				}
			}
		}
		
		for (var bonus in bonusList) {
			this.armorClass += bonus.get();
			if (bonus.isTouch) {
				this.touchAC += bonus.get();
			}
			if(bonus.isFlatfooted) {
				this.flatfooted += bonus.get();
			}
			if (bonus.isCmd) {
				this.baseCmd += bonus.get();
			}
			if (bonus.isCmd && bonus.isFlatfooted) {
				this.baseCmdFlat += bonus.get();
			}
		}
		
	}
	
	this.calculate();
    


};

function stackingBonus() {
	this.value = 0;
	this.add = function(bonus) {
		value += bonus;
	}
	this.remove = function(bonus) {
		value -= bonus;
	}
	this.get = function() {
		return value;
	}
	
}

function acBonus(bonus, touch, flatfooted, cmd) {
	this.bonus = bonus;
	this.isTouch = touch;
	this.isFlatfooted = flatfooted;
	this.isCmd = cmd;
	this.value = [0];
	this.add = function(value) {
		this.bonus.add(value);
	}
	this.remove = function(value) {
		this.bonus.remove(value);
	}
	this.get = function() {
		return this.bonus.get();
	}
}


