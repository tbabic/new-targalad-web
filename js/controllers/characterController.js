console.log("characterController");

function setAttributes(attributes) {
	for (var attrName in attributes) {
		var attrId = attrName + "Id";
		attribute = myCharacter.attributes[attrName];
		if (attribute instanceof Attribute) {
			$("#"+attrId).text(attribute.getValue());
		}
	}
}

function setDefense(defense) {
	$("#armorClassId").text(defense.getArmorClass());
	$("#touchAcId").text(defense.getTouchAc());
	$("#flatFootedId").text(defense.getFlatFootedAc());
}



function setSaves(saves) {
	$("#fortitudeId").text(saves.fort.getValue());
	$("#reflexId").text(saves.reflex.getValue());
	$("#willId").text(saves.will.getValue());
}

function setOffense(offense) {
	var attacks = offense.getAttacks();
	attacks.sort(function(attack1, attack2) {
		return attack2.getToHit() - attack1.getToHit();
	});
	var nextAttackHtml = $("#attack0Id").clone();
	$("#offenseId").empty();
	
	for (var i = 0; i < attacks.length; i++) {
		var attackId = "attack" + i + "Id";
		nextAttackHtml = nextAttackHtml.clone();
		nextAttackHtml.attr("id", attackId);
		$(nextAttackHtml).find("#toHitId").text(attacks[i].getToHit());
		$(nextAttackHtml).find("#dmgBonusId").text(attacks[i].getDmg());
		$("#offenseId").append(nextAttackHtml);
	}
}

function triggerAbility(event) {
	var abilityId = event.target.id;
	var abilityElement = $("#"+abilityId);
	if (abilityElement.hasClass("active")) {
		abilityElement.removeClass("active");
		abilityElement.addClass("not-active");
		triggerModelChange("ABILITY"+abilityId, [], "DEACTIVATED");
	} else if (abilityElement.hasClass("not-active")) {
		abilityElement.removeClass("not-active");
		abilityElement.addClass("active");
		triggerModelChange("ABILITY"+abilityId, [], "ACTIVATED");
	}
}

function setAbilities(character) {
	$("#abilitiesId").empty();
	for (var i = 0; i < character.nonPassiveAbilities.length; i+=3) {
		var divHtml = $('<div class="row"></div>').clone();
		for (var j = 0; j < 3 && (j+i) < character.nonPassiveAbilities.length ; j++) {
			
			var ability = character.nonPassiveAbilities[i+j];
			var spanHtml = $('<div class="col-sm-4"></div>').clone();
			var abilityTemplate = '<button class="btn ability not-active"></button>';
			var abilityHtml = $(abilityTemplate).clone();
			$(abilityHtml).attr("id", ability.id);
			$(abilityHtml).text(ability.name);
			$(spanHtml).append(abilityHtml);
			$(divHtml).append(spanHtml);
			$("#abilitiesId").append(divHtml);
			
			$("#" + ability.id).on("click", triggerAbility);
		}
	}
}

function setConditions(character) {
	
}

function refreshCharacter(character) {
	if (character === undefined) {
		character = myCharacter;
	}
	setAttributes(character.attributes);
	setDefense(character.defense);
	setSaves(character.saves);
	setOffense(character.offense);
	setAbilities(character);
	setConditions(character);
}

addViewListener("ATTRIBUTES",(e) => {
	refreshCharacter(myCharacter);
});

addViewListener("SAVES",(e) => {
	setSaves(myCharacter.saves);
});

addViewListener("DEFENSE",(e, defense) => {
	setDefense(defense);
});

addViewListener("STRENGTH DEXTERITY CONSTITUTION INTELLIGENCE WISDOM CHARISMA",(e, attribute) => {
	attrId = attribute.type.toLowerCase() + "Id";
	$(attrId).text(attribute.getValue());
	refreshCharacter(myCharacter);
});

addViewListener("OFFENSE",(e, offense) => {
	if (offense === undefined) {
		offense = myCharacter.offense;
	}
	setOffense(offense);
});

refreshCharacter(myCharacter);

$(".condition").on("click", function(e) {
	var conditionName = event.target.text.toLowerCase();
	var condition = ConditionFactory[conditionName];
	condition.apply(myCharacter);
	refreshCharacter(myCharacter);
});







