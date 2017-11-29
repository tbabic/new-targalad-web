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
		let elementName = dataset["var"];
		this[elementName] = {};
		//eval("let " + elementName + "=elementName");
		
		
		
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
			if (Array.isArray(matched)) {
				for (let j = 0; j < matched.length; j++) {
					let patternVariable = matched[j].replace(new RegExp("\\$|{|}", "g"), "");
					let value = patternVariable + " no eval!";
					try {
						let expression = patternVariable.split(elementName).join("listElement");
						value = eval(expression);
					} catch(e) {
						console.error(e);
					}
					let matcher = replaceMap[patternVariable];
					elementHtml = elementHtml.replace(matcher, value);
				}
			}
			
			$(this).append(elementHtml);

		}
		
	}
}


customElements.define('c-for-each', forEach);