const path = require('node:path');
const fs = require('node:fs');
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

function resolveWebFiles() {
  const webExtensions = ['.web.tsx', '.web.ts', '.web.jsx', '.web.js'];

  return {
    name: 'resolve-web-files',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer || !source.startsWith('.')) {
        return null;
      }

      const basePath = path.resolve(path.dirname(importer), source);
      for (const extension of webExtensions) {
        const webPath = `${basePath}${extension}`;
        if (fs.existsSync(webPath)) {
          return webPath;
        }
      }

      return null;
    },
  };
}

module.exports = defineConfig({
  root: path.resolve(__dirname, 'desktop'),
  base: './',
  server: {
    fs: {
      allow: [__dirname],
    },
  },
  plugins: [resolveWebFiles(), react()],
  optimizeDeps: {
    exclude: [
      'react-native',
      'react-native-screens',
      'react-native-safe-area-context',
    ],
  },
  resolve: {
    alias: [
      {
        find: /^react-native$/,
        replacement: 'react-native-web',
      },
      {
        find: /^react-native-screens$/,
        replacement: path.resolve(__dirname, 'src/web/react-native-screens.tsx'),
      },
    ],
    extensions: [
      '.web.tsx',
      '.tsx',
      '.web.ts',
      '.ts',
      '.web.jsx',
      '.jsx',
      '.web.js',
      '.js',
      '.json',
    ],
  },
  build: {
    outDir: path.resolve(__dirname, 'desktop/web-build'),
    emptyOutDir: true,
  },
});
