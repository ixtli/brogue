export const tileHeight = 16;
export const tileWidth = 16;
export const tileElementTag = 'span';
export const tileClass = 'tile';

export function newTile(px, py)
{
	var newTile = document.createElement(tileElementTag);
	newTile.className = 'tile';
	newTile.style.top = py + 'px';
	newTile.style.left = px + 'px';
	return newTile;
}

export function TileAttributeDelta(x, y)
{
	this._x = x;
	this._y = y;
	this.bg = null;
	this.opacity = null;
}

TileAttributeDelta.prototype.applyVisualAttributes = function(element)
{
	element.style.backgroundColor = this.bg;
	element.style.opacity = this.opacity;
}

