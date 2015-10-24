var assert = require( 'assert' );
var rollup = require( 'rollup' );
var json = require( '..' );

process.chdir( __dirname );

describe( 'rollup-plugin-json', function () {
	it( 'converts json', function () {
		return rollup.rollup({
			entry: 'samples/basic/main.js',
			plugins: [ json() ]
		}).then( function ( bundle ) {
			var generated = bundle.generate();
			var code = generated.code;

			var fn = new Function( 'assert', code );
			fn( assert );
		});
	});
});
