import {createFilter, makeLegalIdentifier} from 'rollup-pluginutils';

export default function json(options = {}) {
	const filter = createFilter(options.include, options.exclude);
	const indent = 'indent' in options ? options.indent : '\t';
	const declarationType = options.preferConst ? 'const' : 'var';

	return {
		name: 'json',

		transform(json, id) {
			if (id.slice(-5) !== '.json') return null;
			if (!filter(id)) return null;

			const data = JSON.parse(json);
			if (Object.prototype.toString.call(data) !== '[object Object]') {
				return {code: `export default ${json};\n`, map: {mappings: ''}};
			}

			let namedExportCode = '';
			const defaultExportRows = [];
			Object.keys(data).forEach(key => {
				if (key === makeLegalIdentifier(key)) {
					defaultExportRows.push(`${key}: ${key}`);
					namedExportCode += `export ${declarationType} ${key} = ${JSON.stringify(data[key])};\n`;
				} else {
					defaultExportRows.push(`"${key}": ${JSON.stringify(data[key])}`);
				}
			});

			return {
				code: namedExportCode + `export default {\n${indent}${defaultExportRows.join(`,\n${indent}`)}\n};\n`,
				map: {mappings: ''}
			};
		}
	};
}
