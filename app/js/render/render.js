import ListenerMixin from '../mixin/listener';
import { tileWidth, tileHeight } from './tile';

// Amount of ms to wait before resizing again
const resizeWait = 150;
const requestFrame = window.requestAnimationFrame;
export const resizeCallbackFunctionName = 'containerHasResized';

function Renderer()
{
	this._layers = [];

	this._container = $('<div>').attr('id', 'game');
	this._tilesWide = 0;
	this._tilesHigh = 0;
	this._containerWidth = 0;
	this._containerHeight = 0;

	this._resizeListeners = [];
	this._resizeDebounce = _.debounce(this.resize.bind(this), resizeWait);
	this._renderFxn = this.render.bind(this);
}


// Apply mixins
_.extend(Renderer.prototype, ListenerMixin.prototype);


Renderer.prototype.initialize = function()
{
	$('body').prepend(this._container);
	$(window).on('resize', this._resizeDebounce);
	this.registerEvent('resize', resizeCallbackFunctionName);
	this.resize();
	requestFrame(this._renderFxn);
}


Renderer.prototype.destroy = function()
{
	$(window).off('resize');
	this.resetListenerState();
	this._container.empty().remove();
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

	this.triggerEvent('resize', [tilesWide, tilesHigh]);

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
