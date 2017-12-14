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
		modelElement.on(listenOn, callback);
	}
}


function removeModelListener(id, listener ) {
	var modelElement = $("#model");
	if (!listener) {
		listener = "changed";
	}
	var listenOn = "model:" +id + ":" + listener;
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
	modelElement.trigger(listenOn, parameterList);	
}