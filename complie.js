const _ = require('lodash');
const tpl = `<wxs src="./../tools.wxs" module="tools" />
<view> {{tools.msg}} </view>
<view> {{tools.bar(tools.FOO)}} </view>`

const { Parser } = require('htmlparser2');
const ast = {
  type: 'root',
  children: [],
  parent: null,
};
let currentNode = ast;

const parser = new Parser({
  onopentag: (name, attributes) => {
    const newNode = {
      type: 'tag',
      name,
      attributes,
      children: [],
      parent: null
    };
    currentNode.children.push(newNode);
    currentNode = newNode;
    // currentNode.parent = _.cloneDeep(currentNode)
  },
  ontext: (text) => {
    if (text){
      currentNode.children.push({
        type: 'text',
        content: text
      });
    }
  },
  onclosetag: () => {
    // currentNode = currentNode.parent;
  }
})

parser.write(tpl);
parser.end();

console.log("ast", JSON.stringify(ast) );
