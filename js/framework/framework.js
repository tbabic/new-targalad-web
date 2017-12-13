(function($) {
	$.each([ 'show', 'hide' ], function(i, ev) {
		var el = $.fn[ev];
		$.fn[ev] = function() {
			this.trigger(ev);
			return el.apply(this, arguments);
		};
	});
})(jQuery);

function FrameworkIdGenerator() {
	var seed = 0;
	return {generate : function() {return seed++;}};
}

function ManagedValue(matchedString) {
	this.matchedString = matchedString;
	this.expression = matchedString.replace(new RegExp("\\$|{|}", "g"), "");
	this.lastValue = undefined;
	this.newValue = undefined;

	
	this.detectChange = function() {
		this.newValue = eval(this.expression);
		if (this.newValue !== this.lastValue) {
			return true;
		}
		return false;
	};
	
	this.update = function(html) {
		//this.detectChange();
		this.lastValue = this.newValue;
		if (typeof this.newValue === "object") {
			if(html === this.matchedString) {
				return this.newValue;
			} else {
				html.replace(this.matchedString, JSON.stringify(this.newValue));
			}
		}
		return html.replace(this.matchedString, this.newValue);
	};
	
}

function ManagedNode(id, source, element) {
	this.id = id;
	this.source = source;
	this.element = element;
	this.managedValues = [];
	
	let matched = this.source.match(new RegExp("\\${[^}]*}", "g"));
	if (matched != null) {
		for (let i = 0; i< matched.length; i++) {
			this.managedValues.push(new ManagedValue(matched[i]));
		}
	}
	
	this.isManaged= function() {
		return this.managedValues.length > 0;
	}
	
	this.detectChange = function() {
		if (!this.isManaged()) {
			return false;
		}
		let changed = false;
		for (let i = 0; i<this.managedValues.length; i++) {
			if (this.managedValues[i].detectChange()) {
				changed = true;
			}
		}
		return changed;
	}
	
	this.refreshValue = function() {
		let value = this.source;
		for (let i = 0; i<this.managedValues.length; i++) {
			value = this.managedValues[i].update(value);
		}
		return value;
	}
	
	this.updateElement = function() {
		if (!this.detectChange()) {
			return;
		}
		let value = this.refreshValue();
		this.setNodeValue(value);
	}
	
	this.setNodeValue = function() {
		console.error("This function is not implemented");
	}
}

function ManagedAttribute(id, element) {
	let source = element.getAttribute(id);
	ManagedNode.call(this, id, source, element);
	
	this.setNodeValue = function(value) {
		this.element.setAttribute(this.id, value);
	}

}

function ManagedDataAttribute(id, element) {
	let source = $(element).data(id);
	if (typeof source !== "string") {
		ManagedNode.call(this, id, "", element);
	} else {
		ManagedNode.call(this, id, source, element);
	}
	
	
	this.setNodeValue = function(value) {
		$(this.element).data(this.id, value);
	}
	
}

function ManagedTextNode(id, element) {
	let source = element.childNodes[id].nodeValue;
	ManagedNode.call(this, id, source, element);
	
	this.setNodeValue = function(value) {
		this.element.childNodes[id].nodeValue = value;
	}
	
}


function ManagedDomElement(element) {
	this.element = element;
	this.parent = $(element).parent();
	$(element).data("cManagedElement", this);
	this.managedNodes = [];
	this.managedId = framework.idGenerator.generate();
	$(element).data("cManagedId", this.managedId);
	
	for (let i = 0; i < this.element.attributes.length; i++) {
		let managedNode = new ManagedAttribute(this.element.attributes[i].name, this.element)
		if (managedNode.isManaged()) {
			this.managedNodes.push(managedNode);
		}
	}
	
	for (let i in this.element.dataset) {
		let managedNode = new ManagedDataAttribute(i, this.element)
		if (managedNode.isManaged()) {
			this.managedNodes.push(managedNode);
		}
	}
	
	for (let i = 0; i < this.element.childNodes.length; i++) {
		if (this.element.childNodes[i].nodeType != Node.TEXT_NODE) {
			continue;
		}
		let managedNode = new ManagedTextNode(i, this.element)
		if (managedNode.isManaged()) {
			this.managedNodes.push(managedNode);
		}
	}
	
	this.isManaged = function() {
		return this.managedNodes.length > 0;
	};
	
	
	this.update = function() {
		if (!this.isManaged()) {
			return;
		}
		for (let i = 0; i < this.managedNodes.length; i++) {
			this.managedNodes[i].updateElement();
		}
	};
	
	this.update();
	

}


function Framework() {
	
	this.idGenerator = new FrameworkIdGenerator();
	this.managedElements = {};
	this.renderEventsCount = 0;

	this.createDom = function(element) {
		for(let i = 0; i < element.children.length; i++) {
			this.createDom(element.children[i]);
		}
		
		if($(element).data("cManagedElement") === undefined) {
			let managedElement = new ManagedDomElement(element);
			if (managedElement.isManaged()) {
				this.managedElements[managedElement.managedId] = managedElement
				//Utils.arrayAppend(this.managedElements, managedElement);
			}
		}
	};

	
	
	this.render = function() {
		this.renderEventsCount++;
		if (this.renderEventsCount > 1 ) {
			this.renderEventsCount--;
			return;
		}
		var t0 = performance.now();
		$("c-for-each").each(function(index, element){
			if ($(element).is(":visible")) {
				element._update();
			}
		})
		
		
		for (var id in this.managedElements) {
			let element = this.managedElements[id].element;
			if(!jQuery.contains(document.documentElement, element)) {
				delete this.managedElements[id];
			} else if ($(element).is(":visible")) {
				this.managedElements[id].update();
			}
		}
		
		
		var t1 = performance.now();
		this.renderEventsCount = 0;
		console.log("Call took " + (t1 - t0) + " milliseconds.");
	}
	
	let _this = this;
	
	$(document.body).on("render", () => {
		_this.render();
	});
	
	$(document.body).on("click", (event) => {
		console.log(event.currentTarget);
		$(document.body).trigger("render");
	});
	
}

var framework = new Framework();
framework.createDom(document.body);