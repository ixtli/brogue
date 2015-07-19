
function EventData(eventName, callbackName)
{
	this.eventName = eventName;
	this.callbackName = callbackName;
	this.functions = [];
	this.contexts = [];
}

export default function ListenerMixin()
{

}


ListenerMixin.prototype.resetListenerState = function()
{
	this._listenerData = {};
}


ListenerMixin.prototype.registerEvent = function(eventName, callbackName)
{
	var data = this._listenerData || {};

	if (data[eventName])
	{
		console.error('Attempt to double register', eventName);
		return false;
	}

	data[eventName] = new EventData(eventName, callbackName);
	this._listenerData = data;
	return true;
}

ListenerMixin.prototype.listen = function(eventName, handlerObject)
{
	var data = this._listenerData[eventName];

	if (!data)
	{
		console.error(handlerObject, 'attempted to listen for unknown event',
									eventName);
		return;
	}

	const callbackName = data.callbackName;
	const fxn = handlerObject[callbackName];

	if (!fxn)
	{
		console.error(handlerObject, 'did not container callback function',
									callbackName);
		return;
	}

	data.contexts.push(handlerObject);
	data.functions.push(fxn);
}

ListenerMixin.prototype.stopListening = function(eventName, handlerObject)
{
	var data = this._listenerData[eventName];

	if (!data)
	{
		console.error(handlerObject, 'attempted to stop listen for unknown event',
									eventName);
		return;
	}

	const listenerCount = data.functions.length;
	for (var i = 0; i < listenerCount; i++)
	{
		if (handlerObject === data.contexts[i])
		{
			data.contexts.splice(i, 1);
			data.functions.splice(i, 1);
			return;
		}
	}

	console.warn(handlerObject, 'was not listening for', eventName);
}

ListenerMixin.prototype.triggerEvent = function(eventName, args)
{
	const data = this._listenerData[eventName];
	const functions = data.functions;
	const contexts = data.contexts;
	const count = contexts.length;

	for (var i = 0; i < count; i++)
	{
		functions[i].apply(contexts[i], args);
	}
}

