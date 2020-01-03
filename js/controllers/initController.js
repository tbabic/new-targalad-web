console.log("iniController");

function IdGenerator(seed) {
	seed = seed === undefined ? 0: seed;
	return {generate : function() {return seed++;}};
}

idGenerator = new IdGenerator(100000);

function start() {
	console.log("start");
	level = window.localStorage.getItem("character-level");
	createTargalad(level);
	window.localStorage.setItem("character-level", myCharacter.level);
	//start loader
}

var isInitialized = false;

$(document.body).on("update-end", function() {
	if (!isInitialized) {
		isInitialized = true;
		$("#characterView").show();
		$("#initLoader").hide();
	}
	
});


start();


