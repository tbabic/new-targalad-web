console.log("spellbookController");

function serializeSpellBook() {
	var spellbook = myCharacter.getSpellBook();
	var serialize = {
			spells : {},
			memorized : {}
	};
	for(let spellId in spellbook.spells) {
		serialize.spells[spellId] = spellbook.spells[spellId].name;
	}
	window.localStorage.setItem("spellbook", JSON.stringify(serialize));
	
}

function deserializeSpellBook() {
	let spellbook = myCharacter.getSpellBook();
	if (window.localStorage.getItem("spellbook") === undefined || window.localStorage.getItem("spellbook") === null) {
		return;
	}
	var serialize = JSON.parse(window.localStorage.getItem("spellbook"));
	for(let spellId in serialize.spells) {
		let spell = spellsDB.getById(spellId);
		spellbook.addSpell(spell);
		
	}
}
deserializeSpellBook();

var spellbookComponent = httpVue.component("spellbook-component", {
	templateUrl:"views/spellBookView.html",
	data: function() {
		return {
			character: myCharacter,
			allSpells: allSpells,
			spellbook: myCharacter.characterClass.spellbook,
			Utils: Utils,
			selectedLevel: 0
		}
	},
	mounted : function() {
		showSpells();
		
		learnBtn = $(this).find(".learn-btn");
		deleteBtn = $(this).find(".delete-btn");
		$(learnBtn).attr("disabled", true);
		$(deleteBtn).attr("disabled", false);
	},
	computed : {
		spellLevels : function() {
			let spellLevels = [];
			for (let level = 0; level <= this.character.characterClass.maxSpellLevel(); level++) {
				spellLevels.push(level);
			}
			return spellLevels;
		}
	},
	methods : {
		isSpellKnown(spell) {
			return spell.isLearned(this.character);
		},
		isSpellMemorized(spell) {
			return spell.isMemorized(this.character);
		},
		memorizedCount(spell) {
			return spell.memorizedCount(this.character);
		},
		learnSpell(spell) {
			this.spellbook.addSpell(spell);
			this.$forceUpdate();
			
		},
		deleteSpell(spell) {
			this.spellbook.deleteSpell(spell);
			this.$forceUpdate();
			
		},
		memorizeSpell(spell) {
			let memorizedSpells = this.character.getMemorizedSpells();
			memorizedSpells.add(spell);
			this.$forceUpdate()
		},
		unmemorizeSpell(spell) {
			let memorizedSpells = this.character.getMemorizedSpells();
			memorizedSpells.remove(spell);
			this.$forceUpdate()
		},
		castSpell(spell) {
			let memorizedSpells = this.character.getMemorizedSpells();
			memorizedSpells.castSpell(spell);
			this.$forceUpdate()
		},
		recallSpell(spell) {
			let memorizedSpells = this.character.getMemorizedSpells();
			memorizedSpells.recallSpell(spell);
			this.$forceUpdate()
		},
		changeSpellLevel(level) {
			this.selectedLevel = level;
			$("#allSpellsListId").data("spellLevel", +level);
			showSpells();
		}
	}
});



	



$(window).on("unload", function(e) {
	serializeSpellBook();
});

function getSelectedSpellLevel() {
	return $("#allSpellsListId").data("spellLevel");
}


function showSpells() {
	let div = $("#allSpellsListId");
	let toggle = div.data("toggle");
	let spellLevel = getSelectedSpellLevel();
	$(".spell-row").hide();
	$(".spell-row.spell-level-" + spellLevel+"."+toggle).show();
}

$(document.body).on("click", ".spellbook-toggle", function(event) {
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

$(document.body).on("click", ".memorized-configurations > button", function(event) {
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


$(document.body).on("click", "#saveMemorizedId", function(event) {
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
	myCharacter.getMemorizedSpells().reset();
	showSpells();
});






