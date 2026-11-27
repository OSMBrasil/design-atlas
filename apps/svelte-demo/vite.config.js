import path from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import lightningcss from 'vite-plugin-lightningcss';

// Caminhos absolutos: aliases relativos ("../../...") sao resolvidos a partir do
// CWD e quebram em Windows / no runner SSR do SvelteKit, causando o erro
// ERR_UNKNOWN_FILE_EXTENSION ".css" (o Node tenta carregar o CSS como modulo JS).
const root = path.resolve();
const cssDist = path.resolve(root, '../../packages/css/dist');
const svelteDist = path.resolve(root, '../../packages/svelte/dist');

export default defineConfig({
	plugins: [sveltekit(), lightningcss()],
	resolve: {
		alias: {
			'@design-atlas/svelte': path.join(svelteDist, 'index.js'),
			// `import '@design-atlas/css'` (e subpaths) precisa apontar para os
			// arquivos .css reais para que o Vite os trate como CSS.
			'@design-atlas/css/atl-style.css': path.join(cssDist, 'atl-style.css'),
			'@design-atlas/css/atl-reset.css': path.join(cssDist, 'atl-reset.css'),
			'@design-atlas/css': path.join(cssDist, 'atl-style.css')
		}
	},
	server: {
		watch: {
			// Inclui os CSS gerados do pacote no HMR (node_modules e ignorado por padrao).
			ignored: ['!**/packages/css/**']
		}
	}
});
