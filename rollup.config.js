import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const plugins = [];
const config = {
  input: 'src/element-internals.js',
  output: {
    format: 'iife',
    file: 'dist/element-internals.js'
  },
  plugins
};

console.log(process.env.BUILD)
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
