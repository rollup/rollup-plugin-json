import test from 'ava';
import { rollup } from 'rollup';
import json from '..';
import sms from 'source-map-support';

sms.install();

test( 'converting json', t => {
	return rollup({
		entry: 'samples/basic/main.js',
		plugins: [ json() ]
	}).then( bundle => {
		const { code } = bundle.generate();

		const fn = new Function( 't', code );
		fn( t );
	});
});

test( 'generating named exports', t => {
	return rollup({
		entry: 'samples/named/main.js',
		plugins: [ json() ]
	}).then( bundle => {
		const { code } = bundle.generate({ format: 'cjs' });

		let exports = {};
		const fn = new Function( 'exports', code );
		fn( exports );

		t.is( exports.version, '1.33.7' );
		t.ok( code.indexOf( 'this-should-be-excluded' ) === -1, 'should exclude unused properties' );
	});
});
