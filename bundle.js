"use strict";

var foo = "'hello world' from tools.wxs";

var bar = function bar(d) {
  return d;
};

module.exports = {
  FOO: foo,
  bar: bar
};
module.exports.msg = "some msg";