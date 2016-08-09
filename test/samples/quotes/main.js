import config from './config.json';

assert.equal( config.answer['"hi"'], 42 );
