import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import lightningcss from 'vite-plugin-lightningcss';

export default defineConfig({
	plugins: [sveltekit(), lightningcss()],
	resolve: {
		alias: {
			'@design-atlas/svelte': '../../packages/svelte/dist/index.js',
			'@design-atlas/css/atl-style.css': '../../packages/css/dist/atl-style.css',
			'@design-atlas/css/atl-reset.css': '../../packages/css/dist/atl-reset.css',
			'@design-atlas/css': '../../packages/css/dist/atl-style.css'
		}
	}
});
