var gobble = require( 'gobble' );

module.exports = gobble([
	gobble( 'src' ).transform( 'rollup-babel', {
		entry: 'index.js',
		dest: 'rollup-plugin-json.cjs.js',
		format: 'cjs'
	}),

	gobble( 'src' ).transform( 'rollup-babel', {
		entry: 'index.js',
		dest: 'rollup-plugin-json.es6.js',
		format: 'es6'
	})
]);
