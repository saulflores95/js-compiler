const tokenizer = (input) => {
  let current = 0 // Rastrea la posicion de la posicion del codigo
  let tokens = [] // Arreglo donde se almacena
  while (current < input.length) {
    let char = input[current]
    if (char === '(') {
      tokens.push({
        type: 'paren',
        value: '('
      })
      console.log('Open parenthesis PUSHED')
      current++
      continue
    }

    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: ')'
      })
      console.log('Open parenthesis POPPED')
      current++
      continue
    }

    let WS = /\s/
    if (WS.test(char)) {
      current++
      console.log('White Space Detected')
      continue
    }

    let NUMBERS = /[0-9]/
    if (NUMBERS.test(char)) {
      let value = ''
      while (NUMBERS.test(char)) {
        value += char
        char = input[++current]
      }
      console.log('Integer Detected')
      tokens.push({ type: 'number', value })
      continue
    }

    if (char === '"') {
      let value = ''
      char = input[++current]
      while (char !== '"') {
        value += char
        char = input[++current]
      }
      char = input[++current]
      console.log('Double Quotes Detected')
      tokens.push({ type: 'string', value })
      continue
    }
    let LETTERS = /[a-z]/i
    if (LETTERS.test(char)) {
      let value = ''
      while (LETTERS.test(char)) {
        value += char
        char = input[++current]
        console.log('Letter Detected')
      }
      tokens.push({ type: 'name', value })
      continue
    }

    throw new TypeError(`Mmmmm character ${char} is not registered :(`)
  }
  return tokens
}

const parser = (tokens) => {
  let current = 0
  const next = () => {
    let token = tokens[current]
    if (token.type === 'number') {
      current++
      return {
        type: 'NumberLiteral',
        value: token.value
      }
    }
    if (token.type === 'string') {
      current++
      return {
        type: 'StringLiteral',
        value: token.value
      }
    }
    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current]
      let node = {
        type: 'CallExpression',
        name: token.value,
        params: []
      }

      token = tokens[++current]

      while ((token.type !== 'paren') || (token.type === 'paren' && token.value !== ')')) {
        node.params.push(next())
        token = tokens[current]
      }
      current++
      return node
    }
    throw new TypeError(token.type)
  }
  let ast = {
    type: 'Program',
    body: []
  }
  while (current < tokens.length) {
    ast.body.push(next())
  }
  return ast
}

const traverser = (ast, visitor) => {
  const traverseArray = (arr, parent) => {
    arr.forEach(child => {
      traverseNode(child, parent)
    })
  }

  const traverseNode = (node, parent) => {
    let methods = visitor[node.type]
    if (methods && methods.enter) {
      methods.enter(node, parent)
    }
    switch (node.type) {
      case 'Program':
        traverseArray(node.body, node)
        break
      case 'CallExpression':
        traverseArray(node.params, node)
        break
      case 'NumberLiteral':
      case 'StringLiteral':
        break
      default:
        throw new TypeError(node.type)
    }
    if (methods && methods.exit) { methods.exit(node, parent) }
  }
  traverseNode(ast, null)
}

const transformer = (ast) => {
  let newAst = {
    type: 'Program',
    body: []
  }
  ast._context = newAst.body
  traverser(ast, {
    NumberLiteral: {
      enter (node, parent) {
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

        node._context = expression.arguments

        if (parent.type !== 'CallExpression') {
          expression = {
            type: 'ExpressionStatement',
            expression: expression
          }
        }

        parent._context.push(expression)
      }
    }
  })

  return newAst
}

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

const compiler = (input) => {
  let tokens = tokenizer(input)
  let ast = parser(tokens)
  let newAst = transformer(ast)
  let output = codeGen(newAst)
  console.log('OUTPUT = ', output)
}

let input = '(* 2 (cos 0) (+ 4 6))'

console.log(compiler(input))
