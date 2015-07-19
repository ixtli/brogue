import renderer from '../render/render';
import DenseTileLayer from '../render/dense-tile-layer';
import {TileAttributes } from '../render/tile';
import { Rand, EnumFromArray } from '../util';

const worldWidth = 250;
const worldHeight = 125;
const terrain = ['floor', 'wall'];
const terrainEnum = EnumFromArray(terrain);

export default function WorldMap()
{
	this._layer = new DenseTileLayer('world-map');
	this._terrain = new Array();
}


WorldMap.prototype.initialize = function()
{
	// Make the terrain
	this.regenerateTerrain();

	// Make the layer for the map
	const dim = renderer.tileDimensions();
	var layer = this._layer;
	layer.resizeLayer(dim.width, dim.height);

	// Add the map to the renderer
	renderer.addLayer(layer);
	renderer.listenForResize(this);

	// this.randomColors();
}


WorldMap.prototype.regenerateTerrain = function()
{
	console.time('Regenerate Terrain');
	
	const count = worldWidth * worldHeight;
	var arr = new Uint32Array(count);

	const maxWalls = 25;
	const wallCount = Rand.int(maxWalls);
	const wallId = terrainEnum.wall;
	for (var i = 0; i < wallCount; i++)
	{
		arr[i] = wallId;
	}

	this._terrain = arr;
	
	console.timeEnd('Regenerate Terrain');
}


WorldMap.prototype.mapDimensions = function()
{
	return { width: worldWidth, height: worldHeight };
}


WorldMap.prototype.randomColors = function()
{
	const colors = [
		new TileAttributes('red'),
		new TileAttributes('green'),
		new TileAttributes('blue')
	];
	const colorCount = colors.length;
	var layer = this._layer;

	setInterval(function _doStuff() {
		var dimensions = layer.getDimensions();
		const x = Rand.int(dimensions.width - 1);
		const y = Rand.int(dimensions.height - 1);
		const bg = Rand.int(colorCount);
		layer.applyAttributes(x,y,colors[bg]);
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

