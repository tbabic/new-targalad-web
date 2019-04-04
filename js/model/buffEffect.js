function BuffEffect(name, activate, deactivate) {
	this.name = name;
	this.activate = activate;
	this.deactivate = deactivate;
}


BuffsFactory = {
		haste : new BuffEffect("Haste", function(character) {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.UNTYPED, 1, this.name));
			this.bonusEffectList.add(new Bonus([BonusCategory.ARMOR_CLASS, "REFLEX"], BonusType.DODGE, 1, this.name));
			this.bonusEffectList.activate();
			
			this.extraAttackBonus = new ExtraAttackBonus(this.name, "mainHand");
			triggerModelChange("EXTRA_ATTACK", this.extraAttackBonus);
			
		}, function(character){
			this.bonusEffectList.deactivate();
			
			character.offense.removeAttack(this.name);
			delete this.extraAttackBonus;
		}),
		
		heroism : new BuffEffect("Heroism", function() {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus([BonusCategory.TO_HIT, BonusCategory.SAVES, BonusCategory.SKILLS], BonusType.MORALE, 2, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		goodHope : new BuffEffect("Good Hope", function() {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus([BonusCategory.TO_HIT, BonusCategory.DAMAGE, BonusCategory.SAVES, BonusCategory.SKILLS], BonusType.MORALE, 2, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		shield : new BuffEffect("Shield", function() {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus(BonusCategory.ARMOR_CLASS, BonusType.SHIELD, 4, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		catsGrace : new BuffEffect("Cats Grace", function() {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus('DEXTERITY', BonusType.ENHANCEMENT, 4, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),

		bladeTutorsSpirit : new BuffEffect("Blade Tutors Spirit", function() {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, 3, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		})

};



