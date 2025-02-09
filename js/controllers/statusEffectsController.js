var characterBuffs = {};

var buffsContainer = {}

var statusEffectsComponent = httpVue.component("status-effects-component", {
	templateUrl:"views/statusEffectsView.html",
	data: function() {
		return {
			conditions : ConditionsFactory,
			buffs : BuffsFactory,
			activatedBuffs : characterBuffs,
			conditionEffects : Utils.copyVueMap(myCharacter.conditionEffects)
		}
	},
	computed : {
		conditionEffectsComputed : function(){
			var copy = {};
			for (let key in myCharacter.conditionEffects) {
				copy[key] = myCharacter.conditionEffects[key];
			}
			return copy;
		}
	},
	methods : {
		activateCondition : function(condition) {
			condition.apply(myCharacter);
			ConditionStorage.add(condition);
			Utils.copyVueMap(myCharacter.conditionEffects, this.conditionEffects);
		},
		removeConditionEffect:function(conditionEffect) {
			conditionEffect.remove();
			ConditionStorage.remove(conditionEffect);
			Utils.copyVueMap(myCharacter.conditionEffects, this.conditionEffects);
		},
		activateBuff : function(buff) {
			buff.activate(myCharacter);
			Vue.set(this.activatedBuffs, buff.name, buff);
			BuffStorage.add(buff);
		},
		removeBuff : function(buff) {
			buff.deactivate(myCharacter);
			Vue.delete(this.activatedBuffs, buff.name);
			BuffStorage.remove(buff);
		}
	},
	
	mounted : function () {
		
		let buffs = BuffStorage.get();
		for (let i = 0; i < buffs.length; i++)
		{
			for (key in this.buffs)
			{
				if(buffs[i] == this.buffs[key].name)
				{
					this.activateBuff(this.buffs[key]);
				}
			}
			
		}
		
		let conditions = ConditionStorage.get();
		for (let i = 0; i < conditions.length; i++)
		{
			for (key in this.conditions)
			{
				if(conditions[i] == this.conditions[key].name)
				{
					this.activateCondition(this.conditions[key]);
				}
			}
			
		}
		
	}
});