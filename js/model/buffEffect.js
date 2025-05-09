function BuffEffect(name, activate, deactivate) {
	this.name = name;
	this.activate = activate;
	this.deactivate = deactivate;
}


BuffsFactory = {
		
		bless : new BuffEffect("Bless", function() {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus([BonusCategory.TO_HIT], BonusType.MORALE, 1, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		battleCry : new BuffEffect("Battle Cry", function() {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus([BonusCategory.TO_HIT], BonusType.MORALE, 1, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		inspireCourage : new BuffEffect("Inspire Courage", function(character) {
			let bonusValue = 1;
			if (character.level >= 5) {
				bonusValue = 2;
			}
			if (character.level >= 11) {
				bonusValue = 3;
			}
			if (character.level >= 17) {
				bonusValue = 4;
			}
			if (character.level ==12)
			{
				
			    // items;
			    bonusValue++;
			}
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus(['DAMAGE', 'TO_HIT'], BonusType.COMPETENCE, bonusValue, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		aid : new BuffEffect("Aid", function() {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus([BonusCategory.TO_HIT], BonusType.MORALE, 1, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		ancestralBlessing : new BuffEffect("Ancestral Blessing", function(character) {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus([BonusCategory.TO_HIT, BonusCategory.DAMAGE], BonusType.COMPETENCE, 1, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		prayer : new BuffEffect("Prayer", function(character) {
			let bonusValue = 1;
			if (character.getAbilityByName("Fate's Favored") != undefined) {
				bonusValue++;
			}
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus([BonusCategory.TO_HIT, BonusCategory.DAMAGE, BonusCategory.SAVES, BonusCategory.SKILLS], BonusType.LUCK, bonusValue, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		hexFury : new BuffEffect("Hex Fury", function(character) {
			let value = 2;
			if (character.level >= 8) {
				value = 3;
			}
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus([BonusCategory.TO_HIT], BonusType.MORALE, value, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		guidance : new BuffEffect("Guidance", function() {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus([BonusCategory.TO_HIT, BonusCategory.SAVES, BonusCategory.SKILLS], BonusType.COMPETENCE, 1, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		barkskin : new BuffEffect("Barkskin", function(character) {
			let value = 2;
			let level = character.level;
			if (character.masterLevel != null) {
				level = character.masterLevel;
			}
			let bonusValue = Math.floor( (level -3) / 3);
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus([BonusCategory.ARMOR_CLASS], BonusType.NATURAL_ARMOR, value + bonusValue, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		haste : new BuffEffect("Haste", function(character) {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.UNTYPED, 1, this.name));
			this.bonusEffectList.add(new Bonus([BonusCategory.ARMOR_CLASS, "REFLEX"], BonusType.DODGE, 1, this.name));
			this.bonusEffectList.activate();
			
			this.extraAttackBonus = new ExtraAttackBonus(this.name, "mainHand");
			this.extraAttackBonus.attrToHit = character.offense.attrToHit;
			triggerModelChange("EXTRA_ATTACK", this.extraAttackBonus);
			
		}, function(character){
			this.bonusEffectList.deactivate();
			
			character.offense.removeAttack(this.name);
			delete this.extraAttackBonus;
		}),

		BlazingRondo : new BuffEffect("Blazing Rondo", function(character) {
			this.bonusEffectList = new BonusEffectList(this);
			let bonusValue = Math.floor( (character.level) / 5);
			this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.UNTYPED, bonusValue, this.name));
			this.bonusEffectList.add(new Bonus([BonusCategory.ARMOR_CLASS, "REFLEX"], BonusType.DODGE, bonusValue, this.name));
			this.bonusEffectList.activate();
			
			this.extraAttackBonus = new ExtraAttackBonus(this.name, "mainHand");
			this.extraAttackBonus.attrToHit = character.offense.attrToHit;
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
		
		bullsStrength : new BuffEffect("Bulls Strength", function() {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus('STRENGTH', BonusType.ENHANCEMENT, 4, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		ironskin : new BuffEffect("Ironskin", function(character) {
			let value = 4;
			let bonusValue = Math.floor( (character.level -4) / 4);
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus([BonusCategory.ARMOR_CLASS], BonusType.NATURAL_ARMOR, value + bonusValue, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		enlargePerson : new BuffEffect("Enlarge person", function(character) {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus('STRENGTH', BonusType.SIZE, 2, this.name));
			this.bonusEffectList.add(new Bonus('DEXTERITY', BonusType.PENALTY, -2, this.name));
			this.bonusEffectList.add(new Bonus(BonusCategory.ARMOR_CLASS, BonusType.PENALTY, -1, this.name));
			this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.PENALTY, -1, this.name));
			this.bonusEffectList.add(new Bonus(BonusCategory.CMB, BonusType.SIZE, 2, this.name));
			this.bonusEffectList.add(new Bonus(BonusCategory.CMD, BonusType.SIZE, 2, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		reducePerson : new BuffEffect("Reduce person", function(character) {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus('STRENGTH', BonusType.PENALTY, -2, this.name));
			this.bonusEffectList.add(new Bonus('DEXTERITY', BonusType.SIZE, 2, this.name));
			this.bonusEffectList.add(new Bonus(BonusCategory.ARMOR_CLASS, BonusType.SIZE, +1, this.name));
			this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.SIZE, +1, this.name));
			this.bonusEffectList.add(new Bonus(BonusCategory.CMB, BonusType.PENALTY, -2, this.name));
			this.bonusEffectList.add(new Bonus(BonusCategory.CMD, BonusType.PENALTY, -2, this.name));
			this.weapon = character.equipment.weapon;
			this.weapon.reduce();
			this.bonusEffectList.activate();
			
			
		}, function(){
			this.bonusEffectList.deactivate();
			this.weapon.enlarge();
		}),
		
		
		bladeTutorsSpirit : new BuffEffect("Blade Tutors Spirit", function(character) {
			this.isAbilityActive = true;
			this.isBonusActive = false;
			this.character = character;
			this.lock = false;
			this.runActivate = function() {
				if (!this.isAbilityActive) {
					return;
				}
				if (this.lock) {
					return;
				}
				if (this.isBonusActive) {
					this.lock = true;
					this.bonusEffectList.deactivate();
					this.isBonusActive = false;
					this.lock = false;
				}
				let character = this.character;
				let maxBonus = 1 + Math.floor(character.level / 5);
				let abilityNames = ["Spell combat", "Fighting defensively", "Power Attack", "Combat expertise"];
				let totalPenalty = 0;
				for (let i = 0; i < abilityNames.length; i++) {
					let ability = character.getAbilityByName(abilityNames[i]);
					if (ability === undefined) {
						continue;
					}
					let penalty = character.offense.toHitBonusProcessor.getValueBySource(ability.id);
					if (penalty < 0) {
						totalPenalty -= penalty;
					}
				}
				let bonus = maxBonus;
				if (bonus > totalPenalty) {
					bonus = totalPenalty;
				}
				this.bonusEffectList = new BonusEffectList(this);
				this.bonusEffectList.add(new Bonus(BonusCategory.TO_HIT, BonusType.UNTYPED, bonus, this.name));
				this.lock = true;
				this.bonusEffectList.activate();
				this.isBonusActive = true;
				this.lock = false;
			}
			this.runActivate();
			
			addModelListener("TO_HIT", (e, bonusEffect) => {
				this.runActivate();
			});
			
			
		}, function(){
			this.isAbilityActive = false;
			this.lock = true;
			this.bonusEffectList.deactivate();
			this.lock = false;
			
		}),
		seanceBoonDamage : new BuffEffect("Seance boon - dmg", function() {
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus('DAMAGE', BonusType.UNTYPED, 2, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
		}),
		
		inspiringCallAttack : new BuffEffect("Inspiring Call (Att)", function(character) {
			let level = character.level;
			if (character.masterLevel != undefined && character.masterLevel != level) {
				level = character.masterLevel;
			}
			bonusValue = 2+1+Math.floor(level / 4);
			if (BuffsFactory.inspiringCallBonus.isActive) {
				bonusValue++;
			}
			
			this.isActive = true;
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus(['DAMAGE', 'TO_HIT'], BonusType.COMPETENCE, bonusValue, this.name));
			this.bonusEffectList.activate();
		}, function(){
			this.bonusEffectList.deactivate();
			this.isActive = false;
		}),
		
		inspiringCallSaves : new BuffEffect("Inspiring Call (Svs)", function(character) {
			let level = character.level;
			if (character.masterLevel != undefined && character.masterLevel != level) {
				level = character.masterLevel;
			}
			bonusValue = 2+1+Math.floor(level/ 4);
			if (BuffsFactory.inspiringCallBonus.isActive) {
				bonusValue++;
			}
			
			this.bonusEffectList = new BonusEffectList(this);
			this.bonusEffectList.add(new Bonus('SAVES', BonusType.COMPETENCE, bonusValue, this.name));
			this.bonusEffectList.activate();
			this.isActive = true;
			
			
		}, function(){
			this.bonusEffectList.deactivate();
			this.isActive = false;
		}),
		
		inspiringCallBonus : new BuffEffect("Inspiring Call Bonus", function(character) {
			this.isActive = true;
			if (BuffsFactory.inspiringCallAttack.isActive) {
				BuffsFactory.inspiringCallAttack.deactivate(character);
				BuffsFactory.inspiringCallAttack.activate(character);
			}
			if (BuffsFactory.inspiringCallSaves.isActive) {
				BuffsFactory.inspiringCallSaves.deactivate(character);
				BuffsFactory.inspiringCallSaves.activate(character);
			}
			
			
			
			
		},function(character){
			this.isActive = false;
			if (BuffsFactory.inspiringCallAttack.isActive) {
				BuffsFactory.inspiringCallAttack.deactivate(character);
				BuffsFactory.inspiringCallAttack.activate(character);
			}
			if (BuffsFactory.inspiringCallSaves.isActive) {
				BuffsFactory.inspiringCallSaves.deactivate(character);
				BuffsFactory.inspiringCallSaves.activate(character);
			}
		}),

};

var BuffStorage = {
	
	add : function(buff){
		let list = this.get();
		let index = list.indexOf(buff.name);
		if(index == -1)
		{
			list.push(buff.name);
		}
		let newStoreString = JSON.stringify(list);
		window.localStorage.setItem(this.getStoringId(), newStoreString);
	},
	remove : function(buff)
	{
		let list = this.get();
		let index = list.indexOf(buff.name);
		if(index >= 0)
		{
			list.splice(index, 1);
		}
		
		let newStoreString = JSON.stringify(list);
		window.localStorage.setItem(this.getStoringId(), newStoreString);
	},
	
	get : function()
	{
		let storeString = window.localStorage.getItem(this.getStoringId());
		let list = [];
		if (storeString != null) {
			list = JSON.parse(storeString);
		}
		return list;
	},
	
	getStoringId : function() {
		return "buffs"+window.location.pathname;
	},
}



