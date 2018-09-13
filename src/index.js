import {createFilter, dataToEsm} from 'rollup-pluginutils';

export default function json (options = {}) {
	const filter = createFilter(options.include, options.exclude);
	const indent = 'indent' in options ? options.indent : '\t';

	return {
		name: 'json',

		transform (json, id) {
			if (id.slice(-5) !== '.json') return null;
			if (!filter(id)) return null;

			const data = JSON.parse(json);
			if (Object.prototype.toString.call(data) !== '[object Object]') {
				return {code: `export default ${json};\n`, map: {mappings: ''}};
			}

			return {
				code: dataToEsm(data, {
					preferConst: options.preferConst,
					compact: options.compact,
					namedExports: options.namedExports,
					indent
				}),
				map: {mappings: ''}
			};
		}
	};
}
