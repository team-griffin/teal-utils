import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/es/uteals.js',
      format: 'es',
    },
    {
      file: 'dist/cjs/uteals.js',
      format: 'cjs',
    },
  ],
  plugins: [
    resolve({
      extensions: [ '.js', '.ts' ],
    }),
    babel({
      exclude: 'node_modules/**',
      extensions: [ '.js', '.ts' ],
    }),
  ],
  external: [
    'browser-cookies',
    '@team-griffin/capra/map-entries',
    '@team-griffin/capra/invert-obj',
    '@team-griffin/capra/map-obj',
  ],
};
