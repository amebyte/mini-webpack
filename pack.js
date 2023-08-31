const babel = require("@babel/core");

const code = `
const add = require('./module').add;

function multiply(a, b) {
  return a * b;
}
const promise = new Promise();
module.exports = multiply;
`;

const transformedCode = babel.transformSync(code, {
  plugins: ['@babel/plugin-transform-modules-commonjs'],
  presets: ['@babel/preset-env'],
  filename: 'dummy.js'
}).code;

console.log(transformedCode);