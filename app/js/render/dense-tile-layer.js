import renderer from './render';

import {
	newTile,
	tileWidth,
	tileHeight,
	TileAttributeDelta
} from './tile';

function DenseTileLayer(name)
{
	this._name = name;

	this._container = $('<div>').addClass('layer').attr('id', name);
	this._tiles = new Array();

	this._currentWidth = 0;
	this._currentHeight = 0;
	this._diffArray = new Array();
	this._diffList = [];
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
				currentTile.style.top = y + 'px';
				currentTile.style.left = x + 'px';
			}

			newArray[i] = currentTile;

			x += tileWidth;

			if (x >= totalPixelWidth)
			{
				x = 0;
				y += tileHeight;
			}
		}

		this._currentWidth = newWidth;
		this._currentHeight = newHeight;
		this._container.append(newTiles);
		this._tiles = newArray;
		this._diffArray = new Array(newTotal);
		this._diffList = [];

		return diff;
}


DenseTileLayer.prototype.getContainer = function()
{
	return this._container;
}


DenseTileLayer.prototype.setBG = function(x, y, bg)
{
	var array = this._diffArray;
	var list = this._diffList;
	const idx = x + (y * this._currentWidth);

	if (array[idx])
	{
		array[idx].bg = bg;
		return;
	}

	var delta = new TileAttributeDelta(x, y);
	delta.bg = bg;
	array[idx] = delta;
	this._diffList.push(delta);
}


DenseTileLayer.prototype.getDimensions = function()
{
	return { width: this._currentWidth, height: this._currentHeight };
}


DenseTileLayer.prototype.update = function()
{
	var array = this._diffArray;
	var list = this._diffList;
	var tiles = this._tiles;
	const currentWidth = this._currentWidth;
	const count = list.length;
	for (var i = count - 1; i >= 0; i--)
	{
		var cur = list[i];
		var idx = cur._x + (cur._y * currentWidth);
		cur.applyVisualAttributes(tiles[idx]);
	}

	// Do NOT delete the array because a dense tile layer will reach a max size
	this._difList = [];
}


export default DenseTileLayer;

