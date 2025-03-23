var characterBuffs = {};

var buffsContainer = {}

var statusEffectsComponent = httpVue.component("status-effects-component", {
	templateUrl:"views/statusEffectsView.html",
	data: function() {
		return {
			conditions : ConditionsFactory,
			buffs : BuffsFactory,
			activatedBuffs : characterBuffs,
			conditionEffects : Utils.copyVueMap(myCharacter.conditionEffects),
			selectedCondition : null,
			conditionOptions : [],
			freshModal : false,
		}
	},
	computed : {
		conditionEffectsComputed : function(){
			var copy = {};
			for (let key in myCharacter.conditionEffects) {
				copy[key] = myCharacter.conditionEffects[key];
			}
			return copy;
		},
		enableConfirmOptions : function(){
			let enabled = false;
			for(let i = 0; i < this.conditionOptions.length; i++)
			{
				if (this.conditionOptions[i].value < 0)
				{
					return false;
				}
				else if(this.conditionOptions[i].value > 0)
				{
					enabled = true;
				}
			}
			return enabled;
		}
	},
	methods : {
		showOptions : function(condition) {
			this.selectedCondition = condition;
			this.conditionOptions.splice(0, this.conditionOptions.length);
			condition.options.forEach((option) => {
				this.conditionOptions.push({
					option : option,
					value:  option.value
				})
			});
			
			$('#statusOptionModal').modal('show');
		},
			
		
		addCondition : function(condition) {
			if(condition.options == null)
			{
				this.activateCondition(condition);
				return;
			}
			this.freshModal = true;
			this.showOptions(condition);
			
			
		},
		
		
		activateCondition : function(condition) {
			if(condition.options != null)
			{
				this.conditionOptions.forEach((wrapper) => {
					wrapper.option.value = wrapper.value
				});
			}
			condition.apply(myCharacter);
			ConditionStorage.add(condition);
			Utils.copyVueMap(myCharacter.conditionEffects, this.conditionEffects);
		},
		removeConditionEffect:function(conditionEffect) {
			if(conditionEffect.options == null)
			{
				this.deactivateCondition(conditionEffect);
				return;
			}
			this.freshModal = false;
			this.showOptions(conditionEffect);
		},
		
		deactivateCondition:function(conditionEffect) {
			if(conditionEffect.options != null)
			{
				conditionEffect.options.forEach((option) => {
					option.value = option.defaultValue;
				});
			}
			
			
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
				if(conditions[i].name == this.conditions[key].name)
				{
					if(conditions[i].options != null)
					{
						for(let j = 0; j < conditions[i].options.length; j++)
						{
							this.conditions[key].options[j].value = conditions[i].options[j].value;
						}
					}
					this.activateCondition(this.conditions[key]);
				}
			}
			
		}
		
	}
});