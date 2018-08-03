class forEach extends HTMLElement {
	constructor() {
	// Always call super first in constructor
		super();
		
		this._innerHtml = $(this).html().trim();
		
		this._addElement = function(i, matched, replaceMap) {
			let elementHtml = this._innerHtml;
			var listElement = this.list[i];
			
			let elementName = this.listName + "["+i+"]";
			
			if (Array.isArray(matched)) {
				for (let j = 0; j < matched.length; j++) {
					
					let patternVariable = matched[j].replace(new RegExp("\\$|{|}", "g"), "");
					let expressionParts = patternVariable.split(".");
					if (expressionParts[0] === this.dataset["var"]) {
						expressionParts[0] = elementName;
					}
					let expression = "${"+expressionParts.join(".")+"}";
					let matcher = replaceMap[patternVariable];
					elementHtml = elementHtml.replace(matcher, expression);
					
		
				}
			}
//			let elementToAppend = $(elementHtml).wrap("<c-element></c-element>").parent();
			$(this).append(elementHtml);
			return elementHtml;
		};
		
		this._update = function() {
			
			this.listName = this.getAttribute("list");
			let list;
			try {
				list = eval(this.listName);
			} catch (e) {
				list = [];
			}
			if (list === undefined) {
				list = [];
			}
		
			
			if (Array.isArray(list) && list.length === this.lastLength) {
				return;
			} else if (Object.keys(list).length === this.lastLength) {
				return;
			}
			
			this.list = list;
			if (Array.isArray(list)) {
				this.lastLength = this.list.length;
			} else {
				this.lastLength = Object.keys(list).length;
			}
			

			
			$(this).empty();
			
			let replaceMap = {};
			let matched = this._innerHtml.match(new RegExp("\\${[^}]*}", "g"));
			if (Array.isArray(matched)) {
				for (let i = 0; i <matched.length; i++) {
					let patternVariable = matched[i].replace(new RegExp("\\$|{|}", "g"), "");
					replaceMap[patternVariable] = matched[i];
				}
			}
			
			if (Array.isArray(list)) {
				for(let i = 0; i<list.length; i++) {
					this._addElement(i, matched, replaceMap);
				}
			} else {
				for (let i in list) {
					this._addElement("'"+i+"'", matched, replaceMap);
				}
			}
			
			if (window.framework !== undefined) {
				framework.createDom(this);
			}
			
			
		};
		
		this._update();
		
		
		
		
		
		
		
		
		
	}
}


customElements.define('c-for-each', forEach);