console.log("characterController");


function showAbilityOptions(ability) {
	$('#chooseAbilityOptionModal').find(".modal-body").empty();
	$('#chooseAbilityOptionModal').data("ability", ability);
	$("#confirmAbilityOptionId").data("ability", ability);
	let templateHtml = $("#abilityOptionTemplateId").html();
	let abilityOptions = ability.activationOptions.getOptions();
	for (let i = 0; i<abilityOptions.length; i++) {
		let abilityOption = abilityOptions[i];
		let optionHtml = $(templateHtml).clone();
		let inputHtml = optionHtml.find(".ability-option-input");
		optionHtml.find(".ability-option-name").text(abilityOption.name);
		inputHtml.data("abilityOption", abilityOption);
		if (abilityOption.type === "string") {
			inputHtml.prop("type", "text");
			inputHtml.val(abilityOption.possibleValues);
		}
		if (abilityOption.type === "range") {
			inputHtml.prop("type", "range");
			let rangeString = abilityOption.possibleValues;
			if (Utils.isFunction(rangeString)) {
				rangeString = rangeString();
			}
			let range = rangeString.split("-");
			let min = + range[0].replace(/\D/g,'');
			let max = + range[1].replace(/\D/g,'');
			
			inputHtml.data("abilityOption", abilityOption);
			inputHtml.before('<span class="range-min">'+min+'</span>');
			inputHtml.after('<span class="range-max">'+max+'</span>');
			inputHtml.slider({
				formatter: function(value) {
					return 'Current value: ' + value;
				},
				min : min,
				max : max,
				value: min,
				tooltip:"always"
			});
			
		}
		
		if (abilityOption.type === "boolean") {
			inputHtml.prop("type", "checkbox");
			
			let off = false;
			let on = true;
			
			if (abilityOption.possibleValues !== undefined) {
				let toggleString = abilityOption.possibleValues;
				toggleString = toggleString.replace("[", "").replace("]", "").replace("(", "").replace(")", "").replace("/", ",");
				let toggle = toggleString.split(",");
				off =  toggle[0];
				on =  toggle[1];
			}
			
			inputHtml.data("off", off);
			inputHtml.data("on", on);
			if (abilityOption.value === undefined) {
				abilityOption.value = off;
			}
			inputHtml.val(abilityOption.value);
			
			inputHtml.bootstrapToggle({
				on : on, 
				off : off
			});
			
			if (abilityOption.value === on) {
				inputHtml.bootstrapToggle('on');
			}
			
			
			
			$(inputHtml).change(toggleChange);
//			$(inputHtml).change(() => {
//				let toggleState = $(inputHtml).prop("checked");
//				if (toggleState === true) {
//					$(inputHtml).val(on);
//				} else {
//					$(inputHtml).val(off);
//				}
//			});
		}
		$('#chooseAbilityOptionModal').find(".modal-body").append(optionHtml);
		$('#chooseAbilityOptionModal').modal('show');
	}
}

toggleChange = function() {
	let toggleState = $(this).prop("checked");
	let on = $(this).data("on");
	let off = $(this).data("off");
	if (toggleState === true) {
		$(this).val(on);
	} else {
		$(this).val(off);
	}
	console.log(toggleState);
};

$(document.body).on('change', '.ability-option-input', function(event) {
	let abilityOption = $(event.target).data("abilityOption");
	abilityOption.value = $(event.target).val();

	
	validateAbilityActivation();
});

function validateAbilityActivation() {
	let inputs = $('#chooseAbilityOptionModal').find(".modal-body").find(".ability-option-input");
	let abilityOptions = [];
	inputs.each(function(index, input) {
		let abilityOption = $(input).data("abilityOption");
		abilityOption.value = $(input).val();
		abilityOptions.push(abilityOption);
	});
	
	let ability = $('#chooseAbilityOptionModal').data("ability");
	let valid = ability.validateActivation(abilityOptions);
	if(valid === true) {
		$("#confirmAbilityOptionId").attr("disabled", false);
	} else {
		$("#confirmAbilityOptionId").attr("disabled", true);
	}
	return;
}

function activateAbility(event, activationOptions) {
	let ability = $(event.target).data("ability");
	let abilityId = ability.id;
	var abilityElement = $("#"+abilityId);
	abilityElement.removeClass("not-active");
	abilityElement.addClass("active");
	ability.activate.apply(ability, activationOptions);
}



function triggerAbility(event) {
	let ability = $(event.target).data("ability");
	let abilityId = ability.id;
	var abilityElement = $("#"+abilityId);
	if ($(event.target).hasClass("active")) {
		abilityElement.removeClass("active");
		abilityElement.addClass("not-active");
		ability.deactivate();
		return;
	}
	
	if (!ability.hasActivationOptions()) {
		activateAbility(event);
		return;
	}
	
	let activationOptions = $(event.target).data("activationOptions");
	if(activationOptions === undefined) {
		showAbilityOptions(ability);
	} else {
		activateAbility(event, activationOptions);
	}
}


$("#confirmAbilityOptionId").on("click", function(event) {
	let inputs = $('#chooseAbilityOptionModal').find(".modal-body").find(".ability-option-input");
	let activationOptions = [];
	inputs.each(function(index, input) {
		let abilityOption = $(input).data("abilityOption");
		abilityOption.value = $(input).val();
		activationOptions.push(abilityOption);
	});
	let ability = $(event.target).data("ability");
	$("#"+ability.id).data("activationOptions", activationOptions);
	activateAbility(event, activationOptions);
});


$(document.body).on('click', '.btn-ability', triggerAbility);

$(document.body).on('click', '.btn-ability-options', function(event) {
	let ability = $(event.currentTarget).data("ability");
	showAbilityOptions(ability);
});










