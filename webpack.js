// 收集依赖
const fs = require('fs')
const path = require('path')
// 抽象语法树 将字符串转化为ast
const parser = require('@babel/parser')
// 一个对ast进行遍历的工具。类似于字符串的replace方法，指定一个正则表达式，就能对字符串进行替换。只不过babel-traverse是对ast进行替换。
// 使用ast对代码修改会更有优势，支持各种语法匹配模式，比如条件表达式、函数表达式，while循环等。前提是代码是符合js、ts语法的
const traverse = require('@babel/traverse').default
// babel本身，主要做ES6转ES5
const babel = require('@babel/core')

/**
 * 获取模块信息
 * @param {*} file 模块名 
 */
function getModuleInfo(file) {
    // 读取文件
    const body = fs.readFileSync(file, 'utf-8')
    // 转化抽象语法树
    const ast = parser.parse(body, {sourceType: 'module'})

    // 节点遍历的过程 节点遍历器 访问者模式

    // 依赖收集
    const deps = {}
    traverse(ast, {
        // visitor
        ImportDeclaration({ node }) {
            const dirname = path.dirname(file)
            const abspath = "./" + path.join(dirname, node.source.value)
            deps[node.source.value] = abspath
        }
    })

    // ES6转成ES5
    const { code } = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"]
    })
    const moduleInfo = { file, deps, code }
    return moduleInfo    
}

getModuleInfo('./es6/index.js')