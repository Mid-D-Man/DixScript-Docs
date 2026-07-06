import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  // wasm-pack's `--target bundler` output (which @dixscript/core re-exports)
  // imports the compiled .wasm file directly as an ES module and expects
  // top-level await for its init. Vite doesn't support either natively —
  // these two plugins are what makes `import { MdixDatabase } from
  // '@dixscript/core'` work without a separate manual init() call.
  plugins: [wasm(), topLevelAwait(), sveltekit()],
  optimizeDeps: {
    // Let esbuild's dep pre-bundling skip the wasm package — it needs to
    // go through the wasm plugin's own handling instead.
    exclude: ['@dixscript/core'],
  },
  build: {
    target: 'esnext', // top-level await requires a modern target
  },
});
