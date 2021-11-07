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

这两段代码在后端Node.js环境是可以运行的，但在前端则运行不了了，因为浏览器中没有exports对象和require方法所以一定会报错。我们做工程化非常重要的一件事情就是模块化，就是通过模块化方式组织代码。js代码也有很多模块的组织方案,比如：esm,cjs。在node后端就是cjs即common.js。

打包之后，各个模块的代码最好不要变化

```javascript
// add.js
`exports.default = function(a, b) { return a + b }`

// index.js
`var add = require('./add.js').default
console.log(add(1, 2))`
```

我们知道在Node.js打包的时候我们会使用sfs.readfileSync()来读取js文件，这样的话js文件会是一个字符串，所以我们需要加个eval执行一下代码。

注意：如果需要将字符串中的代码运行有两个方法，分别是new Function和eval，而eval的执行效率相对比较高

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

模拟实现common.js里的`require`函数

```javascript
function require(file) {
    // 导出模块
    var exports = {};
    (function (exports, code) {
        eval(code)
    })(exports, 'exports.default = function(a, b) { return a + b }')
    return exports
}

var add = require('./add.js').default
console.log(add(1, 2)) // 输出 3
```

继续升级

```javascript
function require(file) {
    const code = list[file]
    // 导出模块
    var exports = {};
    (function (exports, code) {
        eval(code)
    })(exports, '')
    return exports
}

const list = {
    'index.js': `var add = require('./add.js').default
console.log(add(1, 2))`,
    'add.js': `exports.default = function(a, b) { return a + b }`
}
```

继续封装，把上述代码继续封装到一个更大的自运行函数当中。

```javascript
(function (list) {
    function require(file) {
        const code = list[file]
        // 导出模块
        var exports = {};
        (function (exports, code) {
            eval(code)
        })(exports, code)
        return exports
    }
    // 执行入口 index.js
    require('index.js')
})({
    'index.js': `var add = require('add.js').default
console.log(add(1, 2))`,
    'add.js': `exports.default = function(a, b) { return a + b }`
})
```

webpack的运行原理：收集依赖，ES6转ES5，替换require和exports



```javascript
npm init -y
// babel四兄弟
yarn add @babel/parser
yarn add @babel/traverse
yarn add @babel/core
yarn add @babel/preset-env
```



