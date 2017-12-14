console.log("iniController");

function IdGenerator(seed) {
	var seed = seed === undefined ? 0: seed;
	return {generate : function() {return seed++;}};
}

idGenerator = new IdGenerator(100000);

function start() {
	console.log("start");
	createTargalad();
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


