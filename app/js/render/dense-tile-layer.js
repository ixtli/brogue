import renderer from './render';

import {
	newTile,
	setTileScreenLocation,
	tileWidth,
	tileHeight,
	TileAttributes,
} from './tile';

function DenseTileLayer(name)
{
	this._name = name;

	this._container = $('<div>').addClass('layer').attr('id', name);
	this._tiles = new Array();

	this._currentWidth = 0;
	this._currentHeight = 0;
	this._diffArray = new Array();
	this._diffList = new Uint32Array();
	this._diffCount = 0;

	this._dirty = false;
}


DenseTileLayer.prototype.toString = function()
{
	return 'DenseTileLayer ' + this._name
		+ ' (' + this._currentWidth + ',' + this._currentHeight + ')';
}


DenseTileLayer.prototype.resizeLayer = function(newWidth, newHeight)
{
	const newTotal = newWidth * newHeight;
	const oldArray = this._tiles;
	const oldTotal = oldArray.length;
	const diff = newTotal - oldTotal;
	const totalPixelWidth = newWidth * tileWidth;

	var newArray = new Array(newTotal);
	var newTiles = [];
	var x = 0, y = 0, currentTile;
	for (var i = 0; i < newTotal; i++)
	{
		if (i >= oldTotal)
		{
			currentTile = newTile(x, y);
			newTiles.push(currentTile);
		} else {
			currentTile = oldArray[i];
			setTileScreenLocation(x, y, currentTile);
		}

		newArray[i] = currentTile;

		x += tileWidth;

		if (x >= totalPixelWidth)
		{
			x = 0;
			y += tileHeight;
		}
	}

	this._container.append(newTiles);

	this._currentWidth = newWidth;
	this._currentHeight = newHeight;
	this._tiles = newArray;
	this._diffArray = new Array(newTotal);
	this._diffList = new Uint32Array(newTotal);
	this._diffCount = 0;

	return diff;
}


/**
 * Repaint the entire layer based on a subsection of a data array provided.
 * @param {number} top the y value at which to start indexing into data
 * @param {number} left the x value at which to start indexing into data
 * @param {TypedArray} data the data to use as an index into attrs
 * @param {Array} attrs an array of attribute blobs to apply
 **/
DenseTileLayer.prototype.repaint = function(top, left, data, dataWidth, attrs)
{
	console.time('repaint');
	const width = this._currentWidth;
	const tileCount = this._tiles.length;

	var idx = left + (top * dataWidth);
	var y = 0, x = 0;
	var diffArray = this._diffArray;

	for (var i = 0; i < tileCount; i++)
	{
		diffArray[i] = attrs[data[idx]];

		x++;

		if (x >= width)
		{
			x = 0;
			y++;
			idx = left + (y * dataWidth);
		} else {
			idx++;
		}
	}

	// Reapply the entire attribute set
	this._dirty = true;
	
	console.timeEnd('repaint');
}


DenseTileLayer.prototype.getContainer = function()
{
	return this._container;
}


DenseTileLayer.prototype.applyAttributes = function(x, y, attrs)
{
	const idx = x + (y * this._currentWidth);
	this._diffArray[idx] = attrs;
	this._diffList[this._diffCount++] = idx;
}


DenseTileLayer.prototype.getDimensions = function()
{
	return { width: this._currentWidth, height: this._currentHeight };
}


DenseTileLayer.prototype.update = function()
{
	const array = this._diffArray;
	var tiles = this._tiles;
	var i;

	if (this._dirty)
	{
		console.time('full redraw');
		for (i = tiles.length - 1; i >= 0; i--)
		{
			array[i].applyToElement(tiles[i]);
		}
		console.timeEnd('full redraw');
		this._dirty = false;
	} else {
		const list = this._diffList;
		for (i = this._diffCount - 1; i >= 0; i--)
		{
			var idx = list[i];
			array[idx].applyToElement(tiles[idx]);
		}
	}

	this._diffCount = 0;
}


export default DenseTileLayer;

