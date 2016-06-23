import { createFilter, makeLegalIdentifier } from 'rollup-pluginutils';

export default function json ( options = {} ) {
	const filter = createFilter( options.include, options.exclude );

	return {
		name: 'json',

		transform ( json, id ) {
			if ( id.slice( -5 ) !== '.json' ) return null;
			if ( !filter( id ) ) return null;

			let code;
			let ast = {
				type: 'Program',
				sourceType: 'module',
				start: 0,
				end: null,
				body: []
			};

			if ( json[0] !== '{' ) {
				code = `export default ${json};`;

				ast.body.push({
					type: 'ExportDefaultDeclaration',
					start: 0,
					end: code.length,
					declaration: {
						type: 'Literal',
						start: 15,
						end: code.length - 1,
						value: null,
						raw: 'null'
					}
				});
			} else {
				const data = JSON.parse( json );

				const validKeys = [];
				const invalidKeys = [];

				Object.keys( data ).forEach( key => {
					if ( key === makeLegalIdentifier( key ) ) {
						validKeys.push( key );
					} else {
						invalidKeys.push( key );
					}
				});

				let char = 0;
				const namedExports = validKeys.map( key => {
					const declaration = `export var ${key} = ${JSON.stringify( data[ key ] )};`;

					// generate fake AST node while we're here
					ast.body.push({
						type: 'ExportNamedDeclaration',
						start: char,
						end: declaration.length,
						declaration: {
							type: 'VariableDeclaration',
							start: char + 7,
							end: declaration.length,
							declarations: [
								{
									type: 'VariableDeclarator',
									start: char + 11,
									end: declaration.length - 1,
									id: {
										type: 'Identifier',
										start: char + 11,
										end: char + 11 + key.length,
										name: key
									},
									init: {
										type: 'Literal',
										start: char + 11 + key.length + 3,
										end: declaration.length - 1,
										value: null,
										raw: 'null'
									}
								}
							],
							kind: 'var'
						},
						specifiers: [],
						source: null
					});

					char += declaration.length + 1;
					return declaration;
				});

				const defaultExportNode = {
					type: 'ExportDefaultDeclaration',
					start: char,
					end: null,
					declaration: {
						type: 'ObjectExpression',
						start: char + 15,
						end: null,
						properties: []
					}
				};

				char += 18; // 'export default {\n\t'.length'

				const defaultExportRows = validKeys.map( key => {
					const row = `${key}: ${key}`;

					defaultExportNode.declaration.properties.push({
						type: 'Property',
						start: char,
						end: char + row.length,
						method: false,
						shorthand: false,
						computed: false,
						key: {
							type: 'Identifier',
							start: char,
							end: key.length,
							name: key
						},
						value: {
							type: 'Identifier',
							start: char + key.length + 2,
							end: char + row.length,
							name: key
						},
						kind: 'init'
					});

					char += row.length + 3; // ',\n\t'.length

					return row;
				}).concat( invalidKeys.map( key => `"${key}": ${JSON.stringify( data[ key ] )}` ) );

				const defaultExportString = `export default {\n\t${defaultExportRows.join( ',\n\t' )}\n};`;

				ast.body.push( defaultExportNode );
				code = `${namedExports.join( '\n' )}\n${defaultExportString}`;

				defaultExportNode.end = defaultExportNode.declaration.end = code.length - 1;
			}

			ast.end = code.length;

			return { ast, code, map: { mappings: '' } };
		}
	};
}
