console.log("spellbookController");

function showSpells() {
	let div = $("#allSpellsListId");
	let toggle = div.data("toggle");
	let spellLevel = div.data("spellLevel");
	
	$(".spell-row").hide();
	$(".spell-row.spell-level-" + spellLevel+"."+toggle).show();
}

$(".spell-level-btn").on("click", function(event) {
	var spellLevel = event.target.dataset.spellLevel;
//	$(".spell-row").hide();
//	$(".spell-level-" + spellLevel).show();
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
$(".memorize-btn").on("click", function(event) {
	let spell = getSpellFromButton(event.target);
	let spellBook = myCharacter.getSpellBook();
	spellBook.memorize(spell);
	let parent = $(event.target).closest(".spell-row");
	$(parent).addClass("known");
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


