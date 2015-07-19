import renderer from '../render/render';
import DenseTileLayer from '../render/dense-tile-layer';

export default function WorldMap()
{
	this._layer = new DenseTileLayer('world-map');
}

WorldMap.prototype.initialize = function()
{
	const dim = renderer.tileDimensions();
	var layer = this._layer;
	layer.resizeLayer(dim.width, dim.height);
	renderer.addLayer(layer);
	renderer.listenForResize(this);
}

WorldMap.prototype.randomColors = function()
{
	const colors = ['red', 'green', 'blue'];
	const colorCount = colors.length;

	setInterval(function _doStuff() {
		var dimensions = layer.getDimensions();
		const x = Math.floor(Math.random() * (dimensions.width - 1));
		const y = Math.floor(Math.random() * (dimensions.height - 1));
		const bg = Math.floor(Math.random() * (colorCount - 1));
		layer.setBG(x,y,colors[bg]);
	}, 5);
}

WorldMap.prototype.destroy = function()
{
	renderer.stopListeningForResize(this);
	renderer.removeLayer(this._layer);
	this._layer.destroy();
}

WorldMap.prototype.containerHasResized = function(newWidth, newHeight)
{
	this._layer.resizeLayer(newWidth, newHeight);
}

