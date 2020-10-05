require('browser-env')();
require('@babel/register')({
  extensions: [ '.js', '.ts' ],
});

if (!Object.fromEntries) {
  Object.fromEntries = (entries) => entries.reduce((acc, [ key, value ]) => ({
    ...acc,
    [key]: value,
  }), {});
}
