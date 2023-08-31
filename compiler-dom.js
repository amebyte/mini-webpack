const { compile, createVNode, render } = require('@vue/compiler-dom');
const tpl = `<wxs src="./../tools.wxs" module="tools" />
<view> {{tools.msg}} </view>
<view> {{tools.bar(tools.FOO)}} </view>`

const { ast } = compile(tpl);
// console.log("ast", JSON.stringify(ast));

const generate = (ast) => {

 let code = `
    const parentEl = document.getElementsByTagName("body")[0]
    const createElement = (text) => {
        const el = document.createElement("div")
        el.textContent = text
        parentEl.append(el);
    }
 `
 ast.children.forEach(v => {
    if (v.tag === 'wxs') {
        const attrs = {}
        v.props.forEach(o => {
            attrs[o.name] = o.value.content
        })
        code += `const ${attrs.module} = require('${attrs.src}') \n` 
    } else if (v.tag === 'view') {
        v.children.forEach(o => {
            code += `createElement(${o.content.content})\n`
        })
    }
 })
 return code;
}

const code = generate(ast);
console.log("code", code);