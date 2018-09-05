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
			Utils.copyVueMap(myCharacter.conditionEffects, this.conditionEffects);
		},
		removeConditionEffect:function(conditionEffect) {
			conditionEffect.remove();
			Utils.copyVueMap(myCharacter.conditionEffects, this.conditionEffects);
		},
		activateBuff : function(buff) {
			buff.activate(myCharacter);
			Vue.set(this.activatedBuffs, buff.name, buff);
		},
		removeBuff : function(buff) {
			buff.deactivate(myCharacter);
			Vue.delete(this.activatedBuffs, buff.name);
		}
	}
});