# rollup-plugin-json

Convert .json files to ES6 modules:

```js
// import a single property from a JSON file,
// discarding the rest
import { version } from './package.json';
console.log( `running version ${version}` );

// import the whole file as an object
import pkg from './package.json';
console.log( `running version ${pkg.version}` );
```


## Installation

```bash
npm install --save-dev rollup-plugin-json
```


## Usage

```js
import { rollup } from 'rollup';
import json from 'rollup-plugin-json';

rollup({
  entry: 'main.js',
  plugins: [ json() ]
});
```


## License

MIT
