$(".condition").on("click", function(e) {
	var conditionName = event.target.text.toLowerCase();
	var condition = ConditionsFactory[conditionName];
	condition.apply(myCharacter);
//	refreshCharacter(myCharacter);
});

function setConditions(character) {
//	if (character === undefined) {
//		character = myCharacter;
//	}
//	let conditionEffects = character.getConditions();
//	$("#conditionEffectsId").empty();
//	for (let i = 0; i < conditionEffects.length; i++) {
//		let conditionEffect = conditionEffects[i];
//		let conditionEffectHtml = $("#conditionEffectTemplateId").html();	
//		conditionEffectHtml = $(conditionEffectHtml).clone();
//		
//		conditionEffectHtml.find(".btn-condition-effect").text(conditionEffect.name);
//		conditionEffectHtml.find(".btn-condition-effect").data("conditionEffect", conditionEffect);
//		$("#conditionEffectsId").append(conditionEffectHtml);
//	}
}


$(document.body).on("click", ".btn-condition-effect", function(event) {
	let conditionEffect = $(event.currentTarget).data("conditionEffect");
	conditionEffect.remove();
	$(event.currentTarget).remove();
});



$(".buff").on("click", function(e) {
	var buffId = $(event.currentTarget).data("buff");
	var buff = BuffsFactory[buffId];
	buff.activate(myCharacter);
	
	let buffHtml = $("#buffEffectTemplateId").html();	
	buffHtml = $(buffHtml).clone();
	
	buffHtml.find(".btn-buff-effect").text(buff.name);
	buffHtml.find(".btn-buff-effect").data("buff", buff);
	$("#buffEffectsId").append(buffHtml);
	
});




$(document.body).on("click", ".btn-buff-effect", function(event) {
	let buff = $(event.currentTarget).data("buff");
	buff.deactivate(myCharacter);
	$(event.currentTarget).remove();
});