let traverser = require('./traverser')

const transformer = (ast) => {
  let newAst = {
    type: 'Program',
    body: []
  }
  ast._context = newAst.body
  traverser(ast, {
    NumberLiteral: {
      // We'll visit them on enter.
      enter (node, parent) {
        // We'll create a new node also named `NumberLiteral` that we will push to
        // the parent context.
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value
        })
      }
    },
    // Next we have `StringLiteral`
    StringLiteral: {
      enter (node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value
        })
      }
    },
    // Next up, `CallExpression`.
    CallExpression: {
      enter (node, parent) {
        // We start creating a new node `CallExpression` with a nested
        // `Identifier`.
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name
          },
          arguments: []
        }

        // Next we're going to define a new context on the original
        // `CallExpression` node that will reference the `expression`'s arguments
        // so that we can push arguments.
        node._context = expression.arguments

        // Then we're going to check if the parent node is a `CallExpression`.
        // If it is not...
        if (parent.type !== 'CallExpression') {
          // We're going to wrap our `CallExpression` node with an
          // `ExpressionStatement`. We do this because the top level
          // `CallExpression` in JavaScript are actually statements.
          expression = {
            type: 'ExpressionStatement',
            expression: expression
          }
        }

        // Last, we push our (possibly wrapped) `CallExpression` to the `parent`'s
        // `context`.
        parent._context.push(expression)
      }
    }
  })

  return newAst
}

// Just exporting our transformer to be used in the final compiler...
module.exports = transformer
