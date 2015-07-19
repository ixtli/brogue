export const tileHeight = 16;
export const tileWidth = 16;
export const tileElementTag = 'span';
export const tileClass = 'tile';


export function newTile(px, py, attrs)
{
	var newTile = document.createElement(tileElementTag);

	newTile.className = 'tile';
	newTile.style.top = py + 'px';
	newTile.style.left = px + 'px';

	if (attrs)
	{
		attrs.applyToElement(newTile);
	}

	return newTile;
}


export function setTileScreenLocation(px, py, elt)
{
	elt.style.top = py + 'px';
	elt.style.left = px + 'px';
}


export function TileAttributes(bg)
{
	this.bg = bg || null;
	this.fg = null;
	this.opacity = null;
	this.symbol = null;
}


TileAttributes.prototype.applyToElement = function(element)
{
	element.style.backgroundColor = this.bg;
	element.style.color = this.fg;
	element.style.opacity = this.opacity;
	element.textContent = this.symbol;
}

