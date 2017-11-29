var Utils = {
	isFunction : function(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	},
	
	isString : function(stringToCheck) {
		return (typeof stringToCheck === "string" || stringToCheck instanceof String);
	}

};