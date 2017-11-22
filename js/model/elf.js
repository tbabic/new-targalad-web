function Elf(character) {
	this.character = character;
	this.properties = new BonusEffectList([
		new Bonus("PERCEPTION", BonusType.RACIAL, +2, "Keen Senses"),
		new Bonus(BonusCategory.DEFENSIVE_CASTING, BonusType.RACIAL, +2, "Arcane Focus")
		//new Bonus("SPELLCRAFT", BonusType.RACIAL, +2, "Elven Magic")
		//new Bonus("WILL", BonusType.RACIAL, +2, "Elven Magic")
	]);
	
}
