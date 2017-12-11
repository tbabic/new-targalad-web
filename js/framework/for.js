class forEach extends HTMLElement {
	constructor() {
	// Always call super first in constructor
		super();
		
		let dataset = this.dataset;
		let innerHtml = $(this).html().trim();
		let listName = this.getAttribute("list");
		
		let list = eval(listName);
		if (!Array.isArray(list)) {
			console.error(listName + " is not a list");
		}

		
		$(this).data("listValues", list);
		
		$(this).empty();
		
		let replaceMap = {};
		let matched = innerHtml.match(new RegExp("\\${[^}]*}", "g"));
		if (Array.isArray(matched)) {
			for (let i = 0; i <matched.length; i++) {
				let patternVariable = matched[i].replace(new RegExp("\\$|{|}", "g"), "");
				replaceMap[patternVariable] = matched[i];
			}
		}
		
		
		for(let i = 0; i<list.length; i++) {
			let elementHtml = innerHtml;
			var listElement = list[i];
			
			let elementName = listName + "["+i+"]";
			
			if (Array.isArray(matched)) {
				for (let j = 0; j < matched.length; j++) {
					
					let patternVariable = matched[j].replace(new RegExp("\\$|{|}", "g"), "");
					let expressionParts = patternVariable.split(".");
					if (expressionParts[0] === dataset["var"]) {
						expressionParts[0] = elementName;
					}
					let expression = "${"+expressionParts.join(".")+"}";
					let matcher = replaceMap[patternVariable];
					elementHtml = elementHtml.replace(matcher, expression);
					
		
				}
			}
			
			$(this).append(elementHtml);

		}
		
		
	}
}


customElements.define('c-for-each', forEach);