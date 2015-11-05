var assert = require( 'assert' );
var rollup = require( 'rollup' );
var json = require( '..' );

require( 'source-map-support' ).install();

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

	it( 'generates named exports', function () {
		return rollup.rollup({
			entry: 'samples/named/main.js',
			plugins: [ json() ]
		}).then( function ( bundle ) {
			var generated = bundle.generate({ format: 'cjs' });
			var code = generated.code;

			var exports = {};
			var fn = new Function( 'exports', code );
			fn( exports );

			assert.equal( exports.version, '1.33.7' );
			assert.equal( code.indexOf( 'this-should-be-excluded' ), -1, 'should exclude unused properties' );
		});
	});
});
