function CombateManeuvers(character) {
	this.cmb = new CombatManeuverBonus(character);
	this.cmd = new CombatManeuverDefense(character);
	
	this.maneuvers = [
		new Maneuver("Grapple", character),
		new Maneuver("Bull rush", character),
		new Maneuver("Drag", character),
		new Maneuver("Overrun", character),
		new Maneuver("Sunder", character),
		new Maneuver("Trip", character),
		new Maneuver("Disarm", character),
		new Maneuver("Steal", character),
		new Maneuver("Reposition", character),
		new Maneuver("Dirty Trick", character)
	];
	
}

function CombatManeuverBonus(character) {

}

function CombatManeuverDefense(character) {

}


function Maneuver(name, character) {
	this.cmb = undefined;
	this.cmd = undefined;
	if (["Disarm", "Sunder", "Trip"].indexOf(name) > -1) {
		this.usedWithWeapon = true;
	} else {
		this.usedWithWeapon = false;
	}
	this.name = name;
	this.character = character;
	this.bonusProcessor = new BonusProcessor();
}