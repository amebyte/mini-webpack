# webpack原理

### 原型分析

首先我们通过一个制作一个大包文件的原型。

假设有两个js模块，这里我们先假设这两个模块是复合commom.js标准的es5模块。

语法和模块化规范转换的事我们先放一放，后面说。

我们的目的是将这两个模块打包为一个能在浏览器运行的文件，这个文件其实叫bundle.js



我们做工程化非常重要的一件事情就是模块化，js代码也有很多模块的组织方案,比如：esm,cjs。在node后端就是cjs即common.js。

```javascript
// add.js
exports.default = function(a, b) { return a + b }
```

```javascript
// index.js
var add = require('./add.js').default
console.log(add(1, 2))
```

这两段代码在后端Node.js环境是可以运行的，但在前端则运行不了了。