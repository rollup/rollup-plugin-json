import mimeDb from './mime-db.json';

assert.deepEqual( mimeDb[ 'application/1d-interleaved-parityfec' ], {
	source: 'iana'
});
