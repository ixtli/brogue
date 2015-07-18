const path = require('path');

const funnel = require('broccoli-funnel');
const concat = require('broccoli-concat');
const compileSass = require('broccoli-sass');
const concatFiles = require('broccoli-sourcemap-concat');
const mergeTrees = require('broccoli-merge-trees');
const ES6Modules  = require('broccoli-es6modules');

const pkg = require('./package.json');

function getVendorScripts(names)
{
	const len = names.length;
	var ret = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var name = names[i];
		var p = path.join(bowerDir, name, 'bower.json');
		var bj = require('./' + p);
		ret[i] = path.join(name, bj.main);
	}
	return ret;
}

// Specify the different content dirs
const sassDir = 'app/scss';
const jsDir = 'app/js';
const htmlDir = 'app/html';
const staticDir = 'app/static';
const bowerDir = 'bower_components';

// Gather the index 
const indexHTML = funnel(htmlDir, {
	description: 'Index HTML',
	files: ['index.html']
});

// Get everything in the static dir
const staticAssets = funnel(staticDir, {
	description: 'Gather static assets'
});

// Transpile ES6 module format into es5
var applicationJS = new ES6Modules(jsDir, {
	description: 'Modularize application JavaScript',
	esperantoOptions: {
		absolutePaths: true,
		strict: true
	}
});

// Concat main vendor files
// N.b.: This determines concat order
const vendorPaths = getVendorScripts(['requirejs', 'jquery']);
const vendor = concat(bowerDir, {
	description: 'Concat Vendor Scripts',
	inputFiles: vendorPaths,
	outputFile: '/vendor.js'
});

// Concatenate all the JS files into a single file
const scripts = concatFiles(applicationJS, {
	description: 'Concat Application JS',
	inputFiles: [ '**/*.js' ],
	outputFile: '/' + pkg.name + '.js',
	// This bootstraps the application, assumes that the entry point is the
	// default export of the "main" module.
	footer: 'require(["main"],function(a){a["default"]()});'
});

// Tell Broccoli how we want the assets to be compiled
const styles = compileSass([sassDir], 'app.scss', 'app.css');

module.exports = mergeTrees([
	vendor, styles, indexHTML, staticAssets, scripts
]);
