var Utils = {
	isFunction : function(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	},
	
	isString : function(stringToCheck) {
		return (typeof stringToCheck === "string" || stringToCheck instanceof String);
	},

	arrayAppend : function(array, arrayOrValue) {
		if (array === undefined) {
			array = [];
		}
		if (arrayOrValue === undefined) {
			return array;
		}
		var list = (Array.isArray(arrayOrValue)) ? arrayOrValue : [arrayOrValue];
		for (var i = 0; i < list.length; i++) {
			array.push(list[i]);
		}
		return array;
	},
	
	mapToArray : function(map) {
		let array = [];
		for (var key in map) {
			array.push(map[key]);
		}
		return array;
	},
	
	isStringEmpty : function(string) {
		if (string === undefined) {
			return true;
		}
		if (string === null) {
			return true;
		}
		if (string.trim() === '') {
			return true;
		}
		return false;
	},
	
	copyVueMap : function(source, destination) {
		if (destination === undefined) {
			destination = {};
		}
		for (let key in destination) {
			Vue.delete(destination, key);
		}
		for (let key in source) {
			Vue.set(destination, key, source[key]);
		}
		return destination;
		
	}
	
};


