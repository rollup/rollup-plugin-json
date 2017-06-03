import config from './config';
import questions from './dir';

assert.equal(config.answer, 42);
assert.equal(
	questions['Are extensionless imports and /index resolutions a good idea?'],
	'No.'
);
