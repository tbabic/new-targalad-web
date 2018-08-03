console.log("mainController");

$(".navbar-header-btn").on("click", function(event) {
	$(".view").hide();
	var viewName = event.target.dataset.refView;
	$("#"+viewName).show();
});






