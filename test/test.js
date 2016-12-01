var fs = require( 'fs' );
var assert = require( 'assert' );
var rollup = require( 'rollup' );
var json = require( '..' );
var npm = require( 'rollup-plugin-node-resolve' );

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

	it( 'converts json when using systemjs import syntax', function () {
		return rollup.rollup({
			entry: 'samples/systemjs/main.js',
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

	it( 'resolves extensionless imports in conjunction with npm plugin', function () {
		return rollup.rollup({
			entry: 'samples/extensionless/main.js',
			plugins: [ npm({ extensions: [ '.js', '.json' ]}), json() ]
		}).then( function ( bundle ) {
			var generated = bundle.generate();
			var code = generated.code;

			var fn = new Function( 'assert', code );
			fn( assert );
		});
	});

	it( 'generates a correct fake AST', function () {
		var pkg = fs.readFileSync( 'samples/ast/package.json', 'utf-8' );
		var transformed = json().transform( pkg, 'package.json' );

		assert.deepEqual( transformed.ast, {
			"type": "Program",
			"start": 0,
			"end": 159,
			"body": [
				{
					"type": "ExportNamedDeclaration",
					"start": 0,
					"end": 31,
					"declaration": {
						"type": "VariableDeclaration",
						"start": 7,
						"end": 31,
						"declarations": [
							{
								"type": "VariableDeclarator",
								"start": 11,
								"end": 30,
								"id": {
									"type": "Identifier",
									"start": 11,
									"end": 15,
									"name": "name"
								},
								"init": {
									"type": "Literal",
									"start": 18,
									"end": 30,
									"value": null,
									"raw": "null"
								}
							}
						],
						"kind": "var"
					},
					"specifiers": [],
					"source": null
				},
				{
					"type": "ExportNamedDeclaration",
					"start": 32,
					"end": 61,
					"declaration": {
						"type": "VariableDeclaration",
						"start": 39,
						"end": 61,
						"declarations": [
							{
								"type": "VariableDeclarator",
								"start": 43,
								"end": 60,
								"id": {
									"type": "Identifier",
									"start": 43,
									"end": 50,
									"name": "version"
								},
								"init": {
									"type": "Literal",
									"start": 53,
									"end": 60,
									"value": null,
									"raw": "null"
								}
							}
						],
						"kind": "var"
					},
					"specifiers": [],
					"source": null
				},
				{
					"type": "ExportNamedDeclaration",
					"start": 62,
					"end": 89,
					"declaration": {
						"type": "VariableDeclaration",
						"start": 69,
						"end": 89,
						"declarations": [
							{
								"type": "VariableDeclarator",
								"start": 73,
								"end": 88,
								"id": {
									"type": "Identifier",
									"start": 73,
									"end": 80,
									"name": "license"
								},
								"init": {
									"type": "Literal",
									"start": 83,
									"end": 88,
									"value": null,
									"raw": "null"
								}
							}
						],
						"kind": "var"
					},
					"specifiers": [],
					"source": null
				},
				{
					"type": "ExportDefaultDeclaration",
					"start": 90,
					"end": 159,
					"declaration": {
						"type": "ObjectExpression",
						"start": 105,
						"end": 158,
						"properties": [
							{
								"type": "Property",
								"start": 108,
								"end": 118,
								"method": false,
								"shorthand": false,
								"computed": false,
								"key": {
									"type": "Identifier",
									"start": 108,
									"end": 112,
									"name": "name"
								},
								"value": {
									"type": "Identifier",
									"start": 114,
									"end": 118,
									"name": "name"
								},
								"kind": "init"
							},
							{
								"type": "Property",
								"start": 121,
								"end": 137,
								"method": false,
								"shorthand": false,
								"computed": false,
								"key": {
									"type": "Identifier",
									"start": 121,
									"end": 128,
									"name": "version"
								},
								"value": {
									"type": "Identifier",
									"start": 130,
									"end": 137,
									"name": "version"
								},
								"kind": "init"
							},
							{
								"type": "Property",
								"start": 140,
								"end": 156,
								"method": false,
								"shorthand": false,
								"computed": false,
								"key": {
									"type": "Identifier",
									"start": 140,
									"end": 147,
									"name": "license"
								},
								"value": {
									"type": "Identifier",
									"start": 149,
									"end": 156,
									"name": "license"
								},
								"kind": "init"
							}
						]
					}
				}
			],
			"sourceType": "module"
		});
	});
});
