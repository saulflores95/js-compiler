let KEYWORDS = [
  'start', 'end',
  'break',
  'case', 'catch', 'const', 'continue',
  'debugger', 'default', 'delete', 'do',
  'else', 'enum',
  'false', 'finally', 'for', 'function',
  'if', 'in', 'instanceof',
  'new', 'null',
  'return',
  'switch',
  'this', 'throw', 'true', 'try', 'typeof',
  'let', 'void',
  'while', 'with'
]

let OPERATORS = {
  '>>>=': 'ASSIGN_URSH',
  '>>=': 'ASSIGN_RSH',
  '<<=': 'ASSIGN_LSH',
  '|=': 'ASSIGN_BITWISE_OR',
  '^=': 'ASSIGN_BITWISE_XOR',
  '&=': 'ASSIGN_BITWISE_AND',
  '+=': 'ASSIGN_PLUS',
  '-=': 'ASSIGN_MINUS',
  '*=': 'ASSIGN_MUL',
  '/=': 'ASSIGN_DIV',
  '%=': 'ASSIGN_MOD',
  ';': 'SEMICOLON',
  ',': 'COMMA',
  '?': 'HOOK',
  ':': 'COLON',
  '||': 'OR',
  '&&': 'AND',
  '|': 'BITWISE_OR',
  '^': 'BITWISE_XOR',
  '&': 'BITWISE_AND',
  '===': 'STRICT_EQ',
  '==': 'EQ',
  '=': 'ASSIGN',
  '!==': 'STRICT_NE',
  '!=': 'NE',
  '<<': 'LSH',
  '<=': 'LE',
  '<': 'LT',
  '>>>': 'URSH',
  '>>': 'RSH',
  '>=': 'GE',
  '>': 'GT',
  '++': 'INCREMENT',
  '--': 'DECREMENT',
  '+': 'PLUS',
  '-': 'MINUS',
  '*': 'MUL',
  '/': 'DIV',
  '%': 'MOD',
  '!': 'NOT',
  '~': 'BITWISE_NOT',
  '.': 'DOT',
  '[': 'LEFT_BRACKET',
  ']': 'RIGHT_BRACKET',
  '{': 'LEFT_CURLY',
  '}': 'RIGHT_CURLY',
  '(': 'LEFT_PAREN',
  ')': 'RIGHT_PAREN'

}

// Regular Expressions --------------------------------------------------------
// ----------------------------------------------------------------------------
let opMatch = '^'
for (let i in OPERATORS) {
  if (opMatch !== '^') {
    opMatch += '|^'
  }

  opMatch += i.replace(/[?|^&(){}\[\]+\-*\/\.]/g, '\\$&')
}

let opRegExp = new RegExp(opMatch)
let fpRegExp = /^\d+\.\d*(?:[eE][-+]?\d+)?|^\d+(?:\.\d*)?[eE][-+]?\d+|^\.\d+(?:[eE][-+]?\d+)?/
let reRegExp = /^\/((?:\\.|\[(?:\\.|[^\]])*\]|[^\/])+)\/([gimy]*)/
let intRegExp = /^0[xX][\da-fA-F]+|^0[0-7]*|^\d+/
let multiCommentRegExp = /^\/\*(.|[\r\n])*?\*\//m
let commentRegExp = /^\/\/.*/
let identRegExp = /^[$_\w]+/
let wsRegExp = /^[\ \t]+/
let strRegExp = /^'([^'\\]|\\.)*'|^"([^"\\]|\\.)*"/

// Token Class ----------------------------------------------------------------
// ----------------------------------------------------------------------------
function Token () {
  this.col = 1
  this.line = 1
  this.ws = {
    indent: 0,
    before: 0,
    after: 0,
    trailing: 0
  }

  this.type = null
  this.value = null
  this.plain = null
}

// Main Tokenizer function ----------------------------------------------------
// ----------------------------------------------------------------------------
export const tokenizer = (input, tabWidth) => {
  let cursor = 0
  let line = 1
  let col = 0
  let spaceBefore = 0
  let indentation = 0
  let tabExpand = new Array((tabWidth || 4)).join(' ')
  let token = new Token()
  let lastToken = null
  let list = []

  // Grab the inputs
  while (cursor < input.length) {
    // Save the last non-whitespace token
    if (token.type !== 'WHITESPACE') {
      lastToken = token
    }

    // Get the rest
    // We also grab the rest of the line here for regexps
    let sub = input.substring(cursor)
    let subline = sub.substring(0, sub.indexOf('\n'))
    let m = null

    // Create next token
    token = new Token()
    token.line = line
    token.col = col
    token.ws.indent = indentation
    token.ws.before = lastToken.type === 'NEWLINE' ? 0 : spaceBefore
    // Reset whitespace
    spaceBefore = 0
    // Newlines
    if (sub[0] === '\n') {
      lastToken.ws.trailing = token.ws.before
      token.ws.before = 0

      token.type = 'NEWLINE'
      token.value = '\\n'
      token.plain = sub[0]
      col = 0
      line++
      // Multi line comments
      // don't ask how this regexp works just pray that it will never fail
    } else if ((m = sub.match('start'))) {
      token.type = 'START'
      token.plain = 'start'
      token.value = 'START'
    } else if ((m = sub.match(multiCommentRegExp))) {
      token.type = 'MULTI_COMMENT'
      token.plain = m[0]
      token.value = m[0].slice(2, -2)

      let lines = token.plain.split('\n')
      line += lines.length - 1
      col = lines[lines.length - 1].length - m[0].length + 1

      // Comment
    } else if ((m = subline.match(commentRegExp))) {
      token.type = 'COMMENT'
      token.plain = m[0]
      token.value = m[0].substr(2)

      // Float
    } else if ((m = sub.match(fpRegExp))) {
      token.type = 'FLOAT'
      token.plain = m[0]
      token.value = parseFloat(m[0])

      // Integer
    } else if ((m = sub.match(intRegExp))) {
      token.type = 'INTEGER'
      token.plain = m[0]
      token.value = parseInt(m[0])

      // String
    } else if ((m = sub.match(strRegExp))) {
      token.type = 'STRING'
      token.plain = m[0]
      token.value = eval(m[0]) // simpelst way to get the actual js string value, don't beat me, taken from narcissus!

      // Identifier
    } else if ((m = sub.match(identRegExp))) {
      token.value = m[0]
      token.type = KEYWORDS.indexOf(token.value) !== -1 ? 'KEYWORD' : 'IDENTIFIER'

      // Regexp, matches online on the same line and only if we didn't encounter a identifier right before it
    } else if (lastToken.type !== 'IDENTIFIER' && (m = subline.match(reRegExp))) {
      token.type = 'REGEXP'
      token.plain = m[0]
      token.value = m[1]
      token.flags = m[2]

      // Operator
    } else if ((m = sub.match(opRegExp))) {
      // Check for assignments
      let op = OPERATORS[m[0]]
      if (op.substring(0, 6) === 'ASSIGN') {
        token.type = 'ASSIGN'
        if (op === 'ASSIGN') {
          token.operator = null
        } else {
          token.operator = op.substring(7)
        }
      } else {
        token.type = op
      }

      token.value = m[0]

      // Whitespace handling
    } else if ((m = sub.match(wsRegExp))) {
      token.type = 'WHITESPACE'

      // Provide meta information about whitespacing
      spaceBefore = m[0].replace(/\t/g, '    ').length
      if (col === 1) {
        indentation = spaceBefore
      } else {
        lastToken.ws.after = spaceBefore
      }

      // If we ever hit this... we suck
    } else {
      throw new Error('Unexpected: ' + sub[0] + ' on :')
    }

    // Add non-whitespace tokens to stream
    if (token.type !== 'WHITESPACE') {
      list.push(token)
    }

    // Advance cursor by match length
    let len = 1
    if (m) {
      len = m[0].length + m.index
    }

    cursor += len
    col += len
  }
  // Return some API for ya
  let tokenPos = -1
  return {
    peek: function () {
      return list[tokenPos + 1]
    },

    next: function () {
      return list[++tokenPos]
    },

    get: function () {
      return list[tokenPos]
    },
    all: function () {
      return list
    },
    at: function (pos) {
      return list[pos]
    },
    lookahead: function () {
      let i = tokenPos
      i++
      return list[i]
    },
    reset: function () {
      tokenPos = 0
    }

  }
}
