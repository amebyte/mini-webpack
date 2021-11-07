# webpack原理

### 原型分析

首先我们通过一个制作一个大包文件的原型。

假设有两个js模块，这里我们先假设这两个模块是复合commom.js标准的es5模块。

语法和模块化规范转换的事我们先放一放，后面说。

我们的目的是将这两个模块打包为一个能在浏览器运行的文件，这个文件其实叫bundle.js

例如：

```javascript
// add.js
exports.default = function(a, b) { return a + b }
```

```javascript
// index.js
var add = require('./add.js').default
console.log(add(1, 2))
```

这两段代码在后端Node.js环境是可以运行的，但在前端则运行不了了。我们做工程化非常重要的一件事情就是模块化，就是通过模块化方式组织代码。js代码也有很多模块的组织方案,比如：esm,cjs。在node后端就是cjs即common.js。

打包之后，各个模块的代码最好不要变化

```javascript
// add.js
`exports.default = function(a, b) { return a + b }`

// index.js
`var add = require('./add.js').default
console.log(add(1, 2))`
```

然后我们加个eval执行一下代码

```javascript
eval(`exports.default = function(a, b) { return a + b }`)
```

发现报错了，说exports不存在，在common.js里面exports是一个对象，那么我们模拟一个。

```javascript
var exports = {}
eval(`exports.default = function(a, b) { return a + b }`)
console.log(exports.default(1,5)) // 输出6
```

接下来我们发现在common.js里面，在一个文件里的变量，打包到同一个bandle.js文件之后也是不能使用的。所以我们需要使用一个自运行函数隔离一下环境。

```javascript
var exports = {};
(function (exports, code) {
    eval(code)
})(exports, 'exports.default = function(a, b) { return a + b }')
console.log(exports.default(1,5)) // 输出6
```

