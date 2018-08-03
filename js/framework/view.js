class View extends HTMLElement {
	constructor() {
	// Always call super first in constructor
		super();
	
		var path = "views/"+this.getAttribute("view") + ".html";
		var model = $(this).data("model");
		var modelValue = eval(model);
		$(this).data(model, modelValue);
		console.log(path);
		this.viewHtml="";
		
		this.createView = (viewHtml) => {
			if (typeof viewHtml === 'string' || viewHtml instanceof String) {
				var path = "views/"+this.dataset.refView + ".html";
				//$("#viewHolder").append(viewHtml);
				this.viewHtml = viewHtml;
				return;
			}

			var view = $(viewHtml).find(".view");
			var wrap = $("<div></div>").append($(view));
			//$("#viewHolder").append(wrap.html());
			this.viewHtml = wrap.html();
			return;
		};
		
		
		
		
		var jqxhr = $.ajax({
			url:path,
			success: this.createView,
			error: console.log,
			async:false
		});
		
		$(this).append(this.viewHtml);
		//console.log(this.viewHtml);
		
	}
}



$(document.body).on("click", "c-view", function(event) {
	let view = event.currentTarget;
	console.log("clicked: " + view.getAttribute("view"));
	var model = $(this).data("model");
});



customElements.define('c-view', View);