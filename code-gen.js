const codeGen = (node) => {
  switch (node.type) {
    case 'Program':
      return node.body.map(codeGen).join('\n')
    case 'ExpressionStatement':
      return (
        codeGen(node.expression) + ';')
    case 'CallExpression':
      return (codeGen(node.callee) + '(' + node.arguments.map(codeGen).join(', ') + ')')

    case 'Identifier':
      return node.name

    case 'NumberLiteral':
      return node.value

    case 'StringLiteral':
      return '"' + node.value + '"'

    default:
      throw new TypeError(node.type)
  }
}

// Just exporting our code generator to be used in the final compiler...
module.exports = codeGen
