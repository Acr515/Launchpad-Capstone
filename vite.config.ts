import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react-swc';

/* eslint @stylistic/quote-props: 0 */
export default defineConfig({
	plugins: [
		react(),
	],
	base: '/',
	root: 'src',
	publicDir: './public',
	build: {
		emptyOutDir: false,
		outDir: `../build/${new Date().valueOf()}`,
		assetsInlineLimit: 4096,
		copyPublicDir: true,
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					const extType = assetInfo.name?.split('.').at(-1);
					const fileLocation = assetInfo.originalFileName?.split('/');
					let folder = '/';
					if (typeof extType !== 'undefined') {
						if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
							if (typeof fileLocation !== 'undefined' && fileLocation?.at(-3) === 'tasks') {
								folder = `/img/tasks/${fileLocation.at(-2)}/`;
							} else folder = '/img/';
						} else if (/otf|ttf|woff?2/i.test(extType)) {
							folder = '/fonts/';
						} else if (/css/i.test(extType)) {
							folder = '/css/';
						} else {
							return `files/[name]-[hash][extname]`;
						}
					}
					return `assets${folder}[name]-[hash][extname]`;
				},
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
			},
		},
	},
	server: {
		headers: {
			'Strict-Transport-Security': 'max-age=86400; includeSubDomains',
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'DENY',
			'X-XSS-Protection': '1; mode=block',
		},
	},
	resolve: {
		alias: {
			'assets': path.resolve(__dirname, './src/assets'),
			'config': path.resolve(__dirname, './src/config'),
			'public': path.resolve(__dirname, './src/public'),
			'ts': path.resolve(__dirname, './src/ts'),
			'tsx': path.resolve(__dirname, './src/tsx'),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern',
			},
		},
	},
});