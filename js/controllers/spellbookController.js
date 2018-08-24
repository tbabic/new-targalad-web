console.log("spellbookController");

var spellsRepository = {
		spells : []
};

//var loadSpells = function() {
//	let url = "https://docs.google.com/spreadsheets/export?id=1cuwb3QSvWDD7GG5McdvyyRBpqycYuKMRsXgyrvxvLFI&exportFormat=csv";
//	axios.get(url).then(function(response) {
//		
//		Papa.parse(response.data, {
//			delimiter: ",",
//			newline:"\n",
//			header: true,
//			dynamicTyping: true,
//			complete: function(results) {
//				
//				results.data.sort(function(a,b) {
//					if (a.magus === "NULL" && b.magus === "NULL") {
//						return 0;
//					}
//					if (a.magus === "NULL") {
//						return 1;
//					}
//					if (b.magus === "NULL") {
//						return -1;
//					}
//					
//					if (a.magus == b.magus) {
//						if (a.name < b.name) {
//							return -1;
//						}
//						if (a.name > b.name) {
//							return 1;
//						}
//						return 0;
//					}
//					
//					return a.magus-b.magus;
//					
//				});
////				console.log(results.data);
//				for (let i = 0; i < results.data.length; i++) {
//					let row = results.data[i];
//					if (row.magus === "NULL") {
//						continue;
//					}
//					let spell = new Spell(i, row.name, row.magus, row.spell_level);
//					spellsRepository.spells.push(spell);
//						
//				}
//				console.log("spells loaded");
//			},
//			error: function(err) {
//				console.log("error parsing data");
//				console.log(err);
//			}});
//		
//	});
//}();

var spellbookComponent = httpVue.component("spellbook-component", {
	templateUrl:"views/spellBookView.html",
	data: function() {
		return {
			character: myCharacter,
			allSpells: spellsRepository.spells
		}
	},
	mounted : function() {
		showSpells();
		
		learnBtn = $(this).find(".learn-btn");
		deleteBtn = $(this).find(".delete-btn");
		$(learnBtn).attr("disabled", true);
		$(deleteBtn).attr("disabled", false);
	}
});


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
	var spellbook = myCharacter.getSpellBook();
	if (window.localStorage.getItem("spellbook") === undefined || window.localStorage.getItem("spellbook") === null) {
		return;
	}
	var serialize = JSON.parse(window.localStorage.getItem("spellbook"));
	for(let spellId in serialize.spells) {
		let spell = spellsDB.getById(spellId);
		learnSpell(spell);
		
	}
}
	



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

$(document.body).on("click", ".spell-level-btn", function(event) {
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

function learnSpell(spell) {
	let spellBook = myCharacter.getSpellBook();
	spellBook.addSpell(spell);
	let parent = $("#spell-"+spell.id);
	parent.addClass("known");
	parent.find(".learn-btn").attr("disabled", true);
	parent.find(".delete-btn").attr("disabled", false);
	
}

function deleteSpell(spell) {
	let spellBook = myCharacter.getSpellBook();
	spellBook.deleteSpell(spell);
	let parent = $("#spell-"+spell.id);
	parent.removeClass("known");
	parent.find(".learn-btn").attr("disabled", false);
	parent.find(".delete-btn").attr("disabled", true);
	
}

$(document.body).on("click", ".learn-btn",function(event) {
	let spell = getSpellFromButton(event.target);
	learnSpell(spell);
});

$(document.body).on("click", ".delete-btn", function(event) {
	let spell = getSpellFromButton(event.target);
	deleteSpell(spell);

});

function memorizeSpell(spell) {
	let memorizedSpells = myCharacter.getMemorizedSpells()
	memorizedSpells.add(spell);
}

function unmemorizeSpell(spell) {
	let memorizedSpells = myCharacter.getMemorizedSpells()
	memorizedSpells.remove(spell);
}

$(document.body).on("click", ".memorize-btn", function(event) {
	let spell = getSpellFromButton(event.target);
	memorizeSpell(spell);
});

$(document.body).on("click", ".unmemorize-btn", function(event) {
	let spell = getSpellFromButton(event.target);
	unmemorizeSpell(spell);
});

$(document.body).on("click", ".cast-btn", function(event) {
	let spell = getSpellFromButton(event.target);
	let memorizedSpells = myCharacter.memorizedSpells();
	memorizedSpells.castSpell(spell);
});
$(document.body).on("click", ".recall-btn", function(event) {
	let spell = getSpellFromButton(event.target);
	let memorizedSpells = myCharacter.memorizedSpells();
	memorizedSpells.recallSpell(spell);
});

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


$(".spell-row.known").each(function() {
	learnBtn = $(this).find(".learn-btn");
	deleteBtn = $(this).find(".delete-btn");
	$(learnBtn).attr("disabled", true);
	$(deleteBtn).attr("disabled", false);
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


deserializeSpellBook();
//showSpells();





