
function Random()
{
	return Math.random();
}

Random.prototype.int = function(max)
{
	return Math.floor(Math.random() * max);
}

export const Rand = new Random();

export function EnumFromArray(arr)
{
	var ret = {};
	const len = arr.length;

	for (var i = len - 1; i >= 0; i--)
	{
		ret[arr[i]] = i;
	}

	return ret;
}
