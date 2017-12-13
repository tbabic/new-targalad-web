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


function ManagedDomElement(element) {
	this.element = element;
	this.parent = $(element).parent();
	$(element).data("cManagedElement", this);
	this.sourceContent = element.textContent;
	this.managedContentValues = [];
	this.managedAttributes = [];
	this.managedDataset = [];
	this.managedId = framework.idGenerator.generate();
	$(element).data("cManagedId", this.managedId);
	
	for (let i = 0; i < this.element.attributes.length; i++) {
		if(this.element.attributes[i].nodeName.startsWith("data-")) {
			continue;
		}
		let matched = this.element.attributes[i].nodeValue.match(new RegExp("\\${[^}]*}", "g"));
		if (matched !== null) {
			for (let j = 0; j< matched.length; j++) {
				this.managedAttributes.push({
					name : this.element.attributes[i].name,
					managedValue : new ManagedValue(matched[j])
				});
			}
			
		}
	}
	
	for (let i in this.element.dataset) {
		let type = typeof this.element.dataset[i];
		if (type !== "string") {
			continue;
		}
		let matched = this.element.dataset[i].match(new RegExp("\\${[^}]*}", "g"));
		if (matched !== null) {
			for (let j = 0; j< matched.length; j++) {
				this.managedDataset.push({
					name : i,
					managedValue : new ManagedValue(matched[j])
				});
			}
			
		}
	}
	
	let matchedStrings = this.sourceContent.match(new RegExp("\\${[^}]*}", "g"));
	if (Array.isArray(matchedStrings)) {
		for (let i = 0; i < matchedStrings.length; i++) {
			this.managedContentValues.push(new ManagedValue(matchedStrings[i]));
		}
	}
	
	this.isManaged = function() {
		return this.managedAttributes.length > 0 || this.managedContentValues.length > 0;
	};
	
	
	this.update = function() {
		if (!this.isManaged()) {
			return;
		}
		
		let updatedContent = this.sourceContent;
		let htmlChanged = false;
		for (let i = 0; i< this.managedContentValues.length; i++) {
			let managedValue = this.managedContentValues[i];
			if (managedValue.detectChange()) {
				htmlChanged = true;
			}
			updatedContent = managedValue.update(updatedContent);
		}
		if (htmlChanged) {
			this.element.textContent = updatedContent;
		}
		
		for (let i = 0; i < this.managedAttributes.length; i++) {
			let attribute = this.element.getAttribute(this.managedAttributes[i].name)
			let managedValue = this.managedAttributes[i].managedValue;
			managedValue.detectChange();
			attribute = managedValue.update(attribute);
			
			this.element.setAttribute(this.managedAttributes[i].name, attribute);
		}
		
		for (let i = 0; i < this.managedDataset.length; i++) {
			let attribute = this.element.dataset[this.managedDataset[i].name];
			let managedValue = this.managedDataset[i].managedValue;
			managedValue.detectChange();
			attribute = managedValue.update(attribute);
			
			$(this.element).data(this.managedDataset[i].name, attribute);
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