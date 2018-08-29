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
				input: 'samples/basic/main.js',
				plugins: [json()]
			})
			.then(bundle => bundle.generate({ format: 'cjs' }))
			.then(generated => {
				const fn = new Function('assert', generated.code);
				fn(assert);
			});
	});

	it('handles arrays', () => {
		return rollup
			.rollup({
				input: 'samples/array/main.js',
				plugins: [json()]
			})
			.then(bundle => bundle.generate({ format: 'cjs' }))
			.then(generated => {
				const fn = new Function('assert', generated.code);
				fn(assert);
			});
	});

	it('handles literals', () => {
		return rollup
			.rollup({
				input: 'samples/literal/main.js',
				plugins: [json()]
			})
			.then(bundle => bundle.generate({ format: 'cjs' }))
			.then(generated => {
				const fn = new Function('assert', generated.code);
				fn(assert);
			});
	});

	it('generates named exports', () => {
		return rollup
			.rollup({
				input: 'samples/named/main.js',
				plugins: [json()]
			})
			.then(bundle => bundle.generate({ format: 'cjs' }))
			.then(generated => {
				const exports = {};
				const fn = new Function('exports', generated.code);
				fn(exports);

				assert.equal(exports.version, '1.33.7');
				assert.equal(
					generated.code.indexOf('this-should-be-excluded'),
					-1,
					'should exclude unused properties'
				);
			});
	});

	it('resolves extensionless imports in conjunction with the node-resolve plugin', () => {
		return rollup
			.rollup({
				input: 'samples/extensionless/main.js',
				plugins: [resolve({ extensions: ['.js', '.json'] }), json()]
			})
			.then(bundle => bundle.generate({ format: 'cjs' }))
			.then(generated => {
				const fn = new Function('assert', generated.code);
				fn(assert);
			});
	});

	it('handles JSON objects with no valid keys (#19)', () => {
		return rollup
			.rollup({
				input: 'samples/no-valid-keys/main.js',
				plugins: [json()]
			})
			.then(bundle => bundle.generate({ format: 'cjs' }))
			.then(generated => {
				const fn = new Function('assert', generated.code);
				fn(assert);
			});
	});

	it('handles garbage', () => {
		return rollup
			.rollup({
				input: 'samples/garbage/main.js',
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

	it('generates correct code with compact', () => {
		assert.deepEqual(
			json({ compact: true }).transform(read('samples/form/input.json'), 'input.json').code + '\n',
			read('samples/form/compact.js')
		);
	});
});

function read (file) {
	return fs.readFileSync(file, 'utf-8');
}
