$(".condition").on("click", function(e) {
	var conditionName = event.target.text.toLowerCase();
	var condition = ConditionsFactory[conditionName];
	condition.apply(myCharacter);
});


$(document.body).on("click", ".btn-condition-effect", function(event) {
	let conditionEffect = $(event.currentTarget).data("conditionEffect");
	conditionEffect.remove();
});

var characterBuffs = {};

$(".buff").on("click", function(e) {
	var buff = $(event.currentTarget).data("buff");
	buff.activate(myCharacter);
	characterBuffs[buff.name] = buff;
	
});




$(document.body).on("click", ".btn-buff-effect", function(event) {
	let buff = $(event.currentTarget).data("buff");
	buff.deactivate(myCharacter);
	delete characterBuffs[buff.name];
	
});