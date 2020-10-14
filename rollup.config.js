import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const plugins = [typescript({
  rootDir: 'src'
})];
const config = {
  input: 'src/index.ts',
  output: {
    format: 'iife',
    dir: 'dist'
  },
  plugins
};

if (process.env.BUILD === 'dev') {
  plugins.push([
    serve({
      open: true,
      verbose: true,
      contentBase: ['static', 'dist'],
      historyApiFallback: true,
      port: 8181,
    })
  ]);

  plugins.push(
    livereload({
      watch: 'dist'
    })
  );
}

export default config;
