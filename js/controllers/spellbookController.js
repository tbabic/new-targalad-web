console.log("spellbookController");

function getSelectedSpellLevel() {
	return $("#allSpellsListId").data("spellLevel");
}


function updateMemorizedCount() {
	let spellLevel = getSelectedSpellLevel();
	var current = myCharacter.getSpellBook().getMemorizedCount(spellLevel);
	var maximum = myCharacter.getSpellBook().getSpellsPerDay(spellLevel);
	
	if (current === maximum) {
		$(".spell-row.spell-level-" + spellLevel).find(".memorize-btn").attr("disabled", true);
	} else {
		$(".spell-row.spell-level-" + spellLevel).find(".memorize-btn").attr("disabled", false);
	}
	
	var text = "" + current + "/" + maximum;
	$("#memorized-count").text(text);
}

function showSpells() {
	let div = $("#allSpellsListId");
	let toggle = div.data("toggle");
	let spellLevel = getSelectedSpellLevel();
	updateMemorizedCount();
	$(".spell-row").hide();
	$(".spell-row.spell-level-" + spellLevel+"."+toggle).show();
}

$(".spell-level-btn").on("click", function(event) {
	var spellLevel = event.target.dataset.spellLevel;
	$("#allSpellsListId").data("spellLevel", +spellLevel);
	$(".spell-level-btn").attr("disabled", false);
	$(event.target).attr("disabled", true);
	
	showSpells();
	
});

function getSpellFromButton(button) {
	let parent = $(button).closest(".spell-row");
	let spellId =parent.data().spellId;
	return spellsDB.getById(spellId);
}

$(".learn-btn").on("click", function(event) {
	let spell = getSpellFromButton(event.target);
	let spellBook = myCharacter.getSpellBook();
	spellBook.addSpell(spell);
	let parent = $(event.target).closest(".spell-row");
	$(parent).addClass("known");
	$(event.target).attr("disabled", true);

});

function memorizeSpell(spell) {
	let spellBook = myCharacter.getSpellBook();
	spellBook.memorize(spell);
	let parent = $(event.target).closest(".spell-row");
	$(parent).addClass("memorized");
	
	
	updateMemorizedCount();
}

function unmemorizeSpell(spell) {
	let spellBook = myCharacter.getSpellBook();
	var memorizedCount = spellBook.unmemorize(spell);
	let parent = $(event.target).closest(".spell-row");
	if (memorizedCount === 0) {
		$(parent).removeClass("memorized");
		showSpells();
	}
	
	updateMemorizedCount();
}

$(".memorize-btn").on("click", function(event) {
	let spell = getSpellFromButton(event.target);
	memorizeSpell(spell);
});

$(".unmemorize-btn").on("click", function(event) {
	let spell = getSpellFromButton(event.target);
	unmemorizeSpell(spell);
});

$(".cast-btn").on("click", function(event) {
	let spell = getSpellFromButton(event.target);
	let spellBook = myCharacter.getSpellBook();
	spellBook.castSpell(spell);
});
$(".recall-btn").on("click", function(event) {
	let spell = getSpellFromButton(event.target);
	let spellBook = myCharacter.getSpellBook();
	spellBook.recallSpell(spell);
});

$(".spellbook-toggle").on("click", function(event) {
	var classToggle = "toggle-"+event.target.dataset.toggle;
	$("#allSpellsListId").removeClass("toggle-all");
	$("#allSpellsListId").removeClass("toggle-known");
	$("#allSpellsListId").removeClass("toggle-memorized");
	$("#allSpellsListId").addClass(classToggle);
	
	var toggle = event.target.dataset.toggle;
	$("#allSpellsListId").data("toggle", toggle);
	$(".spellbook-toggle").attr("disabled", false);
	$(event.target).attr("disabled", true);
	showSpells();
	
});


$(".spell-row.known").each(function() {
	learnBtn = $(this).find(".learn-btn");
	$(learnBtn).attr("disabled", true);
});

showSpells();

function getMemorizedConfigurations() {
	var memorizedConfigs = window.localStorage.getItem("#memorized-configurations");
	if (memorizedConfigs === undefined || memorizedConfigs === null) {
		memorizedConfigs = [];
	} else {
		memorizedConfigs = JSON.parse(memorizedConfigs);
	}
	return memorizedConfigs;
}

function removeMemorizedConfiguration(memorizedName) {
	var memorizedConfigs = getMemorizedConfigurations();
	var index = memorizedConfigs.indexOf(memorizedName);
	if (index > -1) {
		memorizedConfigs.splice(index, 1);
		window.localStorage.setItem("#memorized-configurations", JSON.stringify(memorizedConfigs));
	}
	window.localStorage.removeItem(memorizedName);
}

function saveMemorizedConfiguration(memorizedName) {
	var memorized = [];
	var spellbook = myCharacter.getSpellBook();
	for (var spellId in spellbook.memorized) {
		memorized.push(spellId);
	}
	var memorizedConfigs = getMemorizedConfigurations();
	if (memorizedConfigs.indexOf(memorizedName) === -1) {
		memorizedConfigs.push(memorizedName);
		window.localStorage.setItem("#memorized-configurations", JSON.stringify(memorizedConfigs));
	}
	window.localStorage.setItem(memorizedName, JSON.stringify(memorized));
}

function loadMemorizedConfiguration(memorizedName) {
	var memorized = JSON.parse(window.localStorage.getItem(memorizedName));
	for (let i = 0; i <memorized.length; i++) {
		let spell =  spellsDB.getById(memorized[i]);
		memorizeSpell(spell);
	}
}

$(".memorized-configurations > button").on("click", function(event) {
	var targetModal = $(event.target).data("target");
	var action = "";
	if (targetModal === "#loadMemorizedModalId") {
		action = "Load";
	} else if (targetModal === "#saveMemorizedModalId") {
		action = "Save";
	}
	
	var body = $(targetModal).find(".existing-memorize-configs");
	$(body).empty();
	var memorizedHtml = $("#memorizedConfigTemplateId").html();
	memorizedHtml = $(memorizedHtml);
	var memorizedConfigs = getMemorizedConfigurations();
	for (let i = 0; i < memorizedConfigs.length; i++ ) {
		let mem = memorizedHtml.clone();
		let button = mem.find(".btn-existing-memorized-config");
		$(button).text(action);
		let field = mem.find(".existing-memorized-name");
		$(field).val(memorizedConfigs[i]);
		$(body).append(mem);
	}
});


$("#saveMemorizedId").on("click", function(event) {
	var memorizedName = $("#memorizedConfigNameId").val();
	saveMemorizedConfiguration(memorizedName);
});

$(document.body).on("click", "saveMemorizedModalId > .btn-existing-memorized", function(event) {
	var memorizedName = $(event.target).data("name");
	saveMemorizedConfiguration(memorizedName);
});



$(document.body).on('click', '.btn-existing-memorized-config' ,function(event){
	let parent = $(event.target).closest(".memorize-config");
	let memorizedInput = parent.find(".existing-memorized-name");
	let memorizedName = $(memorizedInput).val();
	let action = $(event.target).text();
	if(action === "Save") {
		saveMemorizedConfiguration(memorizedName);
	} if (action === "Load") {
		loadMemorizedConfiguration(memorizedName);
	}
});

$(document.body).on('click', '.btn-delete-memorized-config' ,function(event){
	let parent = $(event.target).closest(".memorize-config");
	let memorizedInput = parent.find(".existing-memorized-name");
	let memorizedName = $(memorizedInput).val();
	removeMemorizedConfiguration(memorizedName);
});

$("#resetMemorizedId").on('click', function(event) {
	myCharacter.getSpellBook().resetMemorized();
	showSpells();
});






