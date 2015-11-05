import { createFilter, makeLegalIdentifier } from 'rollup-pluginutils';

export default function json ( options = {} ) {
	const filter = createFilter( options.include, options.exclude );

	return {
		transform ( json, id ) {
			if ( id.slice( -5 ) !== '.json' ) return null;
			if ( !filter( id ) ) return null;

			let code;

			if ( json[0] !== '{' ) {
				code = `export default ${json};`;
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

				const namedExports = validKeys
					.map( key => `export var ${key} = ${JSON.stringify( data[ key ] )};` )
					.join( '\n' );

				const defaultExportRows = validKeys.map( key => `${key}: ${key}` )
					.concat( invalidKeys.map( key => `"${key}": ${JSON.stringify( data[ key ] )}` ) );

				const defaultExports = `export default {\n\t${defaultExportRows.join( ',\n\t' )}\n};`;

				code = `${namedExports}\n${defaultExports}`;
			}

			return { code, map: { mappings: '' } };
		}
	};
}
