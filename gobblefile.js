var gobble = require( 'gobble' );
var babel = require( 'rollup-plugin-babel' );

module.exports = gobble([
	gobble( 'src' ).transform( 'rollup', {
		entry: 'index.js',
		dest: 'rollup-plugin-json.cjs.js',
		plugins: [ babel() ],
		format: 'cjs'
	}),

	gobble( 'src' ).transform( 'rollup', {
		entry: 'index.js',
		dest: 'rollup-plugin-json.es6.js',
		plugins: [ babel() ],
		format: 'es6'
	})
]);
