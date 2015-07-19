import { tileWidth, tileHeight } from './tile';

// Amount of ms to wait before resizing again
const resizeTimeout = 150;
const requestFrame = window.requestAnimationFrame;

function Renderer()
{
	this._layers = [];

	this._container = $('<div>').attr('id', 'game');
	this._tilesWide = 0;
	this._tilesHigh = 0;
	this._containerWidth = 0;
	this._containerHeight = 0;

	this._resizeListeners = [];
	this._resizeDebounceTimeout = 0;
	this._resizeFxn = this.resize.bind(this);
	this._renderFxn = this.render.bind(this);
}

Renderer.prototype.initialize = function()
{
	$('body').prepend(this._container);
	$(window).on('resize', this._resizeEventHandler.bind(this));
	this.resize();
	requestFrame(this._renderFxn);
}

Renderer.prototype.destroy = function()
{
	$(window).off('resize');

	if (this._resizeDebounceTimeout)
	{
		clearTimeout(this._resizeDebounceTimeout);
		this._resizeDebounceTimeout = 0;
	}

	this._container.empty().remove();
}


Renderer.prototype._resizeEventHandler = function()
{
	if (this._resizeDebounceTimeout)
	{
		clearTimeout(this._resizeDebounceTimeout);
	}

	this._resizeDebounceTimeout = setTimeout(this._resizeFxn, resizeTimeout);
}


Renderer.prototype.listenForResize = function(listener)
{
	this._resizeListeners.push(listener);
}


Renderer.prototype.stopListeningForResize = function(listener)
{
	var listeners = this._resizeListeners;
	const size = listeners.length;
	for (var i = 0; i < size; i++)
	{
		if (listners[i] === listner)
		{
			return this._resizeListeners.splice(i, 1);
		}
	}

	console.error('Listener', listener, 'not found.');
	return null;
}


Renderer.prototype.addLayer = function(layer)
{
	this._layers.push(layer);
	// Layers get added on top
	this._container.prepend(layer.getContainer());
}


Renderer.prototype.removeLayer = function(layer)
{
	var layers = this._layers;
	const len = layers.length;
	for (var i = len - 1; i >= 0; i--)
	{
		if (layers[i] === layer)
		{
			this._layers.splice(i, 1);
			layer.getContainer().detach();
			return;
		}
	}
	
	console.error('Layer', layer, 'not registered with renderer.');
}


Renderer.prototype.resize = function()
{
	console.time('resize');
	
	const ctr = this._container;
	const height = ctr.outerHeight();
	const width = ctr.outerWidth();
	const tilesWide = Math.floor(width / tileWidth);
	const tilesHigh = Math.floor(height / tileHeight);
	const totalTiles = tilesWide * tilesHigh;

	// Save state
	this._tilesWide = tilesWide;
	this._tilesHigh = tilesHigh;
	this._totalTiles = totalTiles;
	this._containerWidth = width;
	this._containerHeight = height;

	// Now that we're updated, tell all listeners
	const listeners = this._resizeListeners;
	const listenerCount = listeners.length;
	for (var i = listenerCount - 1; i >= 0; i--)
	{
		listeners[i].containerHasResized(tilesWide, tilesHigh);
	}

	console.timeEnd('resize');

	// Let the user know whats going on
	console.debug('Screen dimensions:', width + 'x' + height);
	console.debug('Tile dimensions:', tilesWide + 'x' + tilesHigh, totalTiles);
}


Renderer.prototype.tileDimensions = function()
{
	return {width: this._tilesWide, height: this._tilesHigh};
}


Renderer.prototype.render = function()
{
	const layers = this._layers;
	const count = layers.length;
	for (var i = 0; i < count; i++)
	{
		layers[i].update();
	}

	requestFrame(this._renderFxn);
}

export default new Renderer();
