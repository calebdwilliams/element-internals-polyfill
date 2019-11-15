import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'src/element-internals.js',
  output: {
    format: 'esm',
    file: 'dist/element-internals.js'
  },
  plugins: [
    serve({
      open: true,
      verbose: true,
      contentBase: ['static', 'dist'],
      historyApiFallback: true,
      port: 8181,
    }),
    livereload({
      watch: 'dist'
    })
  ]
};
