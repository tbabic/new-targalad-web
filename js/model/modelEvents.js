function addModelListener(id, listenerOrCallback, callback ) {
	var modelElement = $("#model");
	var listener = "changed";
	if (listenerOrCallback instanceof Function) {
		callback = listenerOrCallback;
	} else {
		listener = listenerOrCallback;
	}
	if(callback) {
		var listenOn = "model:" +id + ":" + listener;
		listenOn = listenOn.split(" ").join("_");
		modelElement.on(listenOn, callback);
	}
}


function removeModelListener(id, listener ) {
	var modelElement = $("#model");
	if (!listener) {
		listener = "changed";
	}
	var listenOn = "model:" +id + ":" + listener;
	listenOn = listenOn.split(" ").join("_");
	modelElement.off(listenOn, parameterList);	

}

function triggerModelChange(id, parameters, listener ){
	var modelElement = $("#model");
	if (!listener) {
		listener = "changed";
	}
	var parameterList = parameters;
	if (parameters !== undefined && !Array.isArray(parameters)) {
		parameterList = [parameters];
	}
	var listenOn = "model:" +id + ":" + listener;
	listenOn = listenOn.split(" ").join("_");
	modelElement.trigger(listenOn, parameterList);
	modelElement.trigger("model:REFRESH:changed");	
}