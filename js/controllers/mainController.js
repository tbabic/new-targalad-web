$(".navbar-header-btn").on("click", function(event) {
	$(".view").hide();
	var viewName = event.target.dataset.refView;
	$("#"+viewName).show();
});

$(".spell-level-btn").on("click", function(event) {
	$(".spell-row").hide();
	var spellLevel = event.target.dataset.spellLevel;
	$(".spell-level-" + spellLevel).show();
});


function start() {
	createSpells();
	createTargalad();
	
}


function createSpells() {
	var spellsList = $("#spellsListId");
	for (var i=0; i<allSpells.length; i++) {
		spellsList.append(spellHtml(allSpells[i]));
	}
	$(".spell-row").hide();
	$(".spell-level-0").show();
}


function spellHtml(spell) {
	var spellTemplateString = 
		'<div class = "row spell-row spell-level-{spellLevel}" style="display: none">' +
			'<div class="col">' +
				'<a target="_blank" href="http://www.dxcontent.com/SDB_SpellBlock.asp?SDBID={spellId}">{spellName} (Lvl {spellLevel})</a>' +
			'</div>' +
			'<div class="col"><button type="button" class="btn">Learn</button></div>' + 
			'<div class="col"><button type="button" class="btn">Memorize</button></div>' +
			'<div class="col"><button type="button" class="btn">Cast</button></div>' +
			'<div class="col"><button type="button" class="btn">Recall</button></div>' +
		'</div>';
	spellTemplateString = spellTemplateString
		.replace(/{spellId}/g, spell.id)
		.replace(/{spellName}/g, spell.name)
		.replace(/{spellLevel}/g, spell.level);
	var spellHtmlElement = $(spellTemplateString);
	return spellHtmlElement;
}
