import renderer from './render/render';
import WorldMap from './map/world-map';

export default function entryPoint()
{
	console.time('Application Startup');

	renderer.initialize();
	var worldMap = new WorldMap();
	worldMap.initialize();

	console.timeEnd('Application Startup');
}

export function shutDown()
{
	console.time('Shut down application');

	renderer.destroy();

	console.timeEnd('Shut down application');
}

// Convenience
window.shutDown = shutDown;
