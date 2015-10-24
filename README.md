# rollup-plugin-json

Convert .json files to ES6 modules:

```js
import config from './config.json';
console.log( `running version ${config.version}` );
```

**experimental, depends on unreleased version of Rollup**


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
