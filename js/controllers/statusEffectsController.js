var characterBuffs = {};

var buffsContainer = {}

var statusEffectsComponent = httpVue.component("status-effects-component", {
	templateUrl:"views/statusEffectsView.html",
	data: function() {
		return {
			conditions : ConditionsFactory,
			buffs : BuffsFactory,
			activatedBuffs : characterBuffs,
			conditionEffects : copyVueMap(myCharacter.conditionEffects)
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
			copyVueMap(myCharacter.conditionEffects, this.conditionEffects);
		},
		removeConditionEffect:function(conditionEffect) {
			conditionEffect.remove();
			copyVueMap(myCharacter.conditionEffects, this.conditionEffects);
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

var copyVueMap=function(source, destination) {
	if (destination === undefined) {
		destination = {};
	}
	for (let key in destination) {
		Vue.delete(destination, key);
	}
	for (let key in source) {
		Vue.set(destination, key, source[key]);
	}
	return destination;
	
}