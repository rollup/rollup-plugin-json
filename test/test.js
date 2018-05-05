const fs = require('fs');
const assert = require('assert');
const rollup = require('rollup');
const json = require('..');
const resolve = require('rollup-plugin-node-resolve');

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
				const fn = new Function('assert', bundle.generate({ format: 'cjs' }).code);
				fn(assert);
			});
	});

	it('handles arrays', () => {
		return rollup
			.rollup({
				entry: 'samples/array/main.js',
				plugins: [json()]
			})
			.then(bundle => {
				const fn = new Function('assert', bundle.generate({ format: 'cjs' }).code);
				fn(assert);
			});
	});

	it('handles literals', () => {
		return rollup
			.rollup({
				entry: 'samples/literal/main.js',
				plugins: [json()]
			})
			.then(bundle => {
				const fn = new Function('assert', bundle.generate({ format: 'cjs' }).code);
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
				const code = bundle.generate({ format: 'cjs' }).code;

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

	it('resolves extensionless imports in conjunction with the node-resolve plugin', () => {
		return rollup
			.rollup({
				entry: 'samples/extensionless/main.js',
				plugins: [resolve({ extensions: ['.js', '.json'] }), json()]
			})
			.then(bundle => {
				const fn = new Function('assert', bundle.generate({ format: 'cjs' }).code);
				fn(assert);
			});
	});

	it('handles JSON objects with no valid keys (#19)', () => {
		return rollup
			.rollup({
				entry: 'samples/no-valid-keys/main.js',
				plugins: [json()]
			})
			.then(bundle => {
				const fn = new Function('assert', bundle.generate({ format: 'cjs' }).code);
				fn(assert);
			});
	});

	it('handles garbage', () => {
		return rollup
			.rollup({
				entry: 'samples/garbage/main.js',
				plugins: [json()]
			})
			.then(() => {
				throw new Error('Rollup did not throw');
			})
			.catch(err => assert.equal(err.message.indexOf('Unexpected token o'), 0));
	});

	it('does not generate an AST', () => {
		assert.equal(json().transform(read('samples/form/input.json'), 'input.json').ast, undefined);
	});

	it('does not generate source maps', () => {
		assert.deepEqual(
			json().transform(read('samples/form/input.json'), 'input.json').map,
			{ mappings: '' }
		);
	});

	it('generates properly formatted code', () => {
		assert.deepEqual(
			json().transform(read('samples/form/input.json'), 'input.json').code,
			read('samples/form/default.js')
		);
	});

	it('generates correct code with preferConst', () => {
		assert.deepEqual(
			json({ preferConst: true }).transform(read('samples/form/input.json'), 'input.json').code,
			read('samples/form/preferConst.js')
		);
	});

	it('uses custom indent string', () => {
		assert.deepEqual(
			json({ indent: '  ' }).transform(read('samples/form/input.json'), 'input.json').code,
			read('samples/form/customIndent.js')
		);
	});
});

function read(file) {
	return fs.readFileSync(file, 'utf-8');
}
