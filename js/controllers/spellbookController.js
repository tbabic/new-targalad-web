console.log("spellbookController");
$(".spell-level-btn").on("click", function(event) {
	$(".spell-row").hide();
	var spellLevel = event.target.dataset.spellLevel;
	$(".spell-level-" + spellLevel).show();
});

$(".learn-btn").on("click", function(event) {
	//TODO:
});
$(".memorize-btn").on("click", function(event) {
	//TODO:
});
$(".cast-btn").on("click", function(event) {
	//TODO:
});
$(".recall-btn").on("click", function(event) {
	//TODO:
});




