function Dice(diceString){
	this.number = 1;
	this.sides = 3;
	
	this.parse = function(diceString) {
		let diceArray= diceString.split("d");
		if (diceArray.length == 1) {
			this.number = 1;
			this.sides = +diceArray[0];
		} else {
			if (diceArray[0] == "") {
				this.number = 1;
			} else {
				this.number = +diceArray[0];
			}
			this.sides = +diceArray[1];

		}
	}
	
	if (diceString != null && diceString != "") {
		this.parse(diceString);
	}
	
	
	this.toString = function() {
		if(this.number > 1) {
			return this.number + "d" + this.sides;
		}
		else {
			return "d" + this.sides;
		}
	}
	
	this.isEqual = function(dice) {
		return this.number == dice.number && this.sides == dice.sides;
	}
}

function DiceInfo(source, type, diceString) {
	this.source = source;
	this.type = type;
	this.dice = new Dice(diceString);
	
	this.isEqual = function(diceInfo) {
		return this.source == diceInfo.source
			&& this.type == diceInfo.type
			&& this.dice.isEqual(diceInfo.dice);
	}
	
	this.copy = function() {
		return new DiceInfo(this.source, this.type, this.dice.toString());
	}
}


function DiceTypeGroup(type) {
	this.type = type;
	this.diceInfoList = [];
	
	this.totalDice = [];
	this.totalDiceString = "";
	
	
	this.addDiceInfo = function(diceInfo) {
		if (diceInfo.type != this.type) {
			return;
		}
		for (let i = this.diceInfoList.length-1; i >= 0; i--) {
			if (this.diceInfoList[i].source == source) {
				this.diceInfoList.splice(i, 1);
			}
		}
		this.diceInfoList.push(diceInfo);
		this.calculateTotalDice();
	}
	
	this.removeDiceInfoBySource = function(source) {
		for (let i = this.diceInfoList.length-1; i >= 0; i--) {
			if (this.diceInfoList[i].source == source) {
				this.diceInfoList.splice(i, 1);
				this.calculateTotalDice();
			}
		}
	}
	
	this.calculateTotalDice = function() {
		
		let sidesMap = {};
		this.diceInfoList.forEach(diceInfo => {
			
			let dice = sidesMap[diceInfo.dice.sides];
			
			if (dice == null) {
				dice = new Dice();
				dice.sides = diceInfo.dice.sides;
				dice.number = diceInfo.dice.number;
				sidesMap[dice.sides] = dice;
			} else {
				dice.number += diceInfo.dice.number;
			}
		});
		
		this.totalDice.splice(0);
		for(side in sidesMap) {
			this.totalDice.push(sidesMap[side]);
			
		}
		
		this.totalDiceString = "";
		
		this.totalDice.forEach(dice => {
			if (dice.number == 0) {
				return;
			}
			if (this.totalDiceString != "") {
				this.totalDiceString += " + "
			}
			this.totalDiceString += dice.toString();
		})
				
	};
	

}


function DiceCombiner(groupingFunction, groupSortingFunction) {
	this.groupingFunction = groupingFunction;
	this.groupSortingFunction = this.groupSortingFunction;
	this.grouped = [];
	
	this.addDice = function(object) {
		let groupedDice = this.groupingFunction.call(this, object);
		let found = this.grouped.find( g => g.group == groupedDice.group && g.dice.sides == groupedDice.dice.sides );
		if (found == null) {
			let dice = new Dice();
			dice.sides = groupedDice.dice.sides;
			dice.number = groupedDice.dice.number;
			this.grouped.push({
				group : groupedDice.group,
				dice : dice
			});
		} else {
			found.dice.number += groupedDice.dice.number;
		}
		
		this.sort();
		
	}
	
	this.clear = function() {
		this.grouped.splice(0);
	}
	
	this.sort = function() {
		if (groupSortingFunction == null) {
			this.grouped.sort( (a,b) => {
				if (a.group > b.group ) {
					return 1;
				}
				else if (a.group < b.group) {
					return -1;
				}
				else if (a.dice.sides > b.dice.sides) {
					return 1;
				}
				else if (a.dice.sides < b.dice.sides) {
					return -1;
				}
				return 0;
			});
		}
		
		else {
			this.grouped.sort(groupSortingFunction);
		}
	}
	
	
	
}

function DiceManager() {
	this.dice = [];
	this.diceCombiner = new DiceCombiner((diceInfo) => {
		return {
			group : diceInfo.type,
			dice : diceInfo.dice	
		};
	}, (a, b) => {
		let groupSort = 0;
		if (a.group > b.group ) {
			groupSort = 1;
		}
		else if (a.group < b.group) {
			groupSort = -1;
		}
		if (groupSort != 0) {
			if(a.group == "PHYSICAL") { //physical always first
				return -1;
			}
			if(b.group == "PHYSICAL") { //physical always first
				return 1;
			}
			if(a.group == "PRECISION") { //precision always last
				return 1;
			}
			if(b.group == "PRECISION") { //precision always last
				return -1;
			}
			return groupSort;
		}
		if (a.dice.sides > b.dice.sides) {
			return 1;
		}
		else if (a.dice.sides < b.dice.sides) {
			return -1;
		}
		return 0;
			
	});
	this.combinedDice = this.diceCombiner.grouped;
	
	
	this.addDice = function(diceInfo) {
		let found = this.findBySource(diceInfo.source);
		if (found != -1 && this.dice[found].isEqual(diceInfo)) {
			return;
		}
		if (found != -1) {
			this.dice[found] = diceInfo;
			this.recombine();
		}
		else {
			this.dice.push(diceInfo);
			this.diceCombiner.addDice(diceInfo);
		}
		
		
		
	}
	
	this.removeDice = function(source) {
		let found = this.findBySource(source);
		if (found != -1) {
			this.dice.splice(found, 1);
			this.recombine();
			
		}
	}
	
	this.findBySource = function(source) {
		return this.dice.findIndex((diceInfo) => diceInfo.source == source);
	}
	
	this.recombine = function() {
		this.diceCombiner.clear();
		this.dice.forEach(diceInfo => {
			this.diceCombiner.addDice(diceInfo);
		});
	}
	
	
		
}




