const fs = require('fs');
const assert = require('assert');
const rollup = require('rollup');
const json = require('..');
const npm = require('rollup-plugin-node-resolve');

require('source-map-support').install();

process.chdir(__dirname);

describe('rollup-plugin-json', () => {
	it('converts json', () => {
		return rollup
			.rollup({
				entry: 'samples/basic/main.js',
				plugins: [json()]
			})
			.then(bundle => {
				const generated = bundle.generate({ format: 'cjs' });
				const code = generated.code;

				const fn = new Function('assert', code);
				fn(assert);
			});
	});

	it('generates named exports', () => {
		return rollup
			.rollup({
				entry: 'samples/named/main.js',
				plugins: [json()]
			})
			.then(bundle => {
				const generated = bundle.generate({ format: 'cjs' });
				const code = generated.code;

				const exports = {};
				const fn = new Function('exports', code);
				fn(exports);

				assert.equal(exports.version, '1.33.7');
				assert.equal(
					code.indexOf('this-should-be-excluded'),
					-1,
					'should exclude unused properties'
				);
			});
	});

	it('resolves extensionless imports in conjunction with npm plugin', () => {
		return rollup
			.rollup({
				entry: 'samples/extensionless/main.js',
				plugins: [npm({ extensions: ['.js', '.json'] }), json()]
			})
			.then(bundle => {
				const generated = bundle.generate({ format: 'cjs' });
				const code = generated.code;

				const fn = new Function('assert', code);
				fn(assert);
			});
	});

	it('generates a correct fake AST', () => {
		const pkg = fs.readFileSync('samples/ast/package.json', 'utf-8');
		const transformed = json().transform(pkg, 'package.json');

		assert.deepEqual(transformed.ast, {
			type: 'Program',
			start: 0,
			end: 159,
			body: [
				{
					type: 'ExportNamedDeclaration',
					start: 0,
					end: 31,
					declaration: {
						type: 'VariableDeclaration',
						start: 7,
						end: 31,
						declarations: [
							{
								type: 'VariableDeclarator',
								start: 11,
								end: 30,
								id: {
									type: 'Identifier',
									start: 11,
									end: 15,
									name: 'name'
								},
								init: {
									type: 'Literal',
									start: 18,
									end: 30,
									value: null,
									raw: 'null'
								}
							}
						],
						kind: 'var'
					},
					specifiers: [],
					source: null
				},
				{
					type: 'ExportNamedDeclaration',
					start: 32,
					end: 61,
					declaration: {
						type: 'VariableDeclaration',
						start: 39,
						end: 61,
						declarations: [
							{
								type: 'VariableDeclarator',
								start: 43,
								end: 60,
								id: {
									type: 'Identifier',
									start: 43,
									end: 50,
									name: 'version'
								},
								init: {
									type: 'Literal',
									start: 53,
									end: 60,
									value: null,
									raw: 'null'
								}
							}
						],
						kind: 'var'
					},
					specifiers: [],
					source: null
				},
				{
					type: 'ExportNamedDeclaration',
					start: 62,
					end: 89,
					declaration: {
						type: 'VariableDeclaration',
						start: 69,
						end: 89,
						declarations: [
							{
								type: 'VariableDeclarator',
								start: 73,
								end: 88,
								id: {
									type: 'Identifier',
									start: 73,
									end: 80,
									name: 'license'
								},
								init: {
									type: 'Literal',
									start: 83,
									end: 88,
									value: null,
									raw: 'null'
								}
							}
						],
						kind: 'var'
					},
					specifiers: [],
					source: null
				},
				{
					type: 'ExportDefaultDeclaration',
					start: 90,
					end: 159,
					declaration: {
						type: 'ObjectExpression',
						start: 105,
						end: 158,
						properties: [
							{
								type: 'Property',
								start: 108,
								end: 118,
								method: false,
								shorthand: false,
								computed: false,
								key: {
									type: 'Identifier',
									start: 108,
									end: 112,
									name: 'name'
								},
								value: {
									type: 'Identifier',
									start: 114,
									end: 118,
									name: 'name'
								},
								kind: 'init'
							},
							{
								type: 'Property',
								start: 121,
								end: 137,
								method: false,
								shorthand: false,
								computed: false,
								key: {
									type: 'Identifier',
									start: 121,
									end: 128,
									name: 'version'
								},
								value: {
									type: 'Identifier',
									start: 130,
									end: 137,
									name: 'version'
								},
								kind: 'init'
							},
							{
								type: 'Property',
								start: 140,
								end: 156,
								method: false,
								shorthand: false,
								computed: false,
								key: {
									type: 'Identifier',
									start: 140,
									end: 147,
									name: 'license'
								},
								value: {
									type: 'Identifier',
									start: 149,
									end: 156,
									name: 'license'
								},
								kind: 'init'
							}
						]
					}
				}
			],
			sourceType: 'module'
		});
	});

	it('generates a correct fake AST with preferConst', () => {
		const pkg = fs.readFileSync('samples/ast/package.json', 'utf-8');
		const transformed = json({ preferConst: true }).transform(
			pkg,
			'package.json'
		);

		assert.deepEqual(transformed.ast, {
			type: 'Program',
			start: 0,
			end: 165,
			body: [
				{
					type: 'ExportNamedDeclaration',
					start: 0,
					end: 33,
					declaration: {
						type: 'VariableDeclaration',
						start: 7,
						end: 33,
						declarations: [
							{
								type: 'VariableDeclarator',
								start: 13,
								end: 32,
								id: {
									type: 'Identifier',
									start: 13,
									end: 17,
									name: 'name'
								},
								init: {
									type: 'Literal',
									start: 20,
									end: 32,
									value: null,
									raw: 'null'
								}
							}
						],
						kind: 'const'
					},
					specifiers: [],
					source: null
				},
				{
					type: 'ExportNamedDeclaration',
					start: 34,
					end: 65,
					declaration: {
						type: 'VariableDeclaration',
						start: 41,
						end: 65,
						declarations: [
							{
								type: 'VariableDeclarator',
								start: 47,
								end: 64,
								id: {
									type: 'Identifier',
									start: 47,
									end: 54,
									name: 'version'
								},
								init: {
									type: 'Literal',
									start: 57,
									end: 64,
									value: null,
									raw: 'null'
								}
							}
						],
						kind: 'const'
					},
					specifiers: [],
					source: null
				},
				{
					type: 'ExportNamedDeclaration',
					start: 66,
					end: 95,
					declaration: {
						type: 'VariableDeclaration',
						start: 73,
						end: 95,
						declarations: [
							{
								type: 'VariableDeclarator',
								start: 79,
								end: 94,
								id: {
									type: 'Identifier',
									start: 79,
									end: 86,
									name: 'license'
								},
								init: {
									type: 'Literal',
									start: 89,
									end: 94,
									value: null,
									raw: 'null'
								}
							}
						],
						kind: 'const'
					},
					specifiers: [],
					source: null
				},
				{
					type: 'ExportDefaultDeclaration',
					start: 96,
					end: 165,
					declaration: {
						type: 'ObjectExpression',
						start: 111,
						end: 164,
						properties: [
							{
								type: 'Property',
								start: 114,
								end: 124,
								method: false,
								shorthand: false,
								computed: false,
								key: {
									type: 'Identifier',
									start: 114,
									end: 118,
									name: 'name'
								},
								value: {
									type: 'Identifier',
									start: 120,
									end: 124,
									name: 'name'
								},
								kind: 'init'
							},
							{
								type: 'Property',
								start: 127,
								end: 143,
								method: false,
								shorthand: false,
								computed: false,
								key: {
									type: 'Identifier',
									start: 127,
									end: 134,
									name: 'version'
								},
								value: {
									type: 'Identifier',
									start: 136,
									end: 143,
									name: 'version'
								},
								kind: 'init'
							},
							{
								type: 'Property',
								start: 146,
								end: 162,
								method: false,
								shorthand: false,
								computed: false,
								key: {
									type: 'Identifier',
									start: 146,
									end: 153,
									name: 'license'
								},
								value: {
									type: 'Identifier',
									start: 155,
									end: 162,
									name: 'license'
								},
								kind: 'init'
							}
						]
					}
				}
			],
			sourceType: 'module'
		});
	});

	it('handles JSON objects with no valid keys (#19)', () => {
		return rollup
			.rollup({
				entry: 'samples/no-valid-keys/main.js',
				plugins: [json()]
			})
			.then(bundle => {
				const generated = bundle.generate({ format: 'cjs' });
				const code = generated.code;

				const fn = new Function('assert', code);
				fn(assert);
			});
	});

	it('uses custom indent string', () => {
		assert.equal(
			json({ indent: '  ' }).transform(
				read(`samples/custom-indent/input.json`),
				'input.json'
			).code,
			read('samples/custom-indent/output.js')
		);
	});

	it('handles garbage', () => {
		return rollup
			.rollup({
				entry: 'samples/garbage/main.js',
				plugins: [json()]
			})
			.catch(err => {
				assert.equal(err.message.indexOf('Unexpected token o'), 0);
			});
	});
});

function read(file) {
	return fs.readFileSync(file, 'utf-8');
}
