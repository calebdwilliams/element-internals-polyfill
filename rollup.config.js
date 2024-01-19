import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import cleanup from 'rollup-plugin-cleanup';

const plugins = [typescript({
  target: 'es2015',
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
} else {
  plugins.push(cleanup({
    extensions: [ '.ts', '.js' ]
  }))
}

export default config;
