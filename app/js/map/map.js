import renderer from '../render/render';
import DenseTileLayer from '../render/dense-tile-layer';

export default function WorldMap()
{
	this._layer = new DenseTileLayer();
}

WorldMap.prototype.initialize = function()
{
	renderer.addLayer(this._layer);
	renderer.listenForResize(this);
}

WorldMap.prototype.destroy = function()
{
	renderer.stopListeningForResize(this);
}

WorldMap.prototype.containerHasResized = function(newWidth, newHeight)
{
	this._layer.resizeLayer(newWidth, newHeight);
}
