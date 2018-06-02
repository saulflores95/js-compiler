let beautify = require('js-beautify').js

let cProgram = ''
let cInit = '#include <stdio.h>\n#include <stdlib.h>\n'
let types = ['INTEGER', 'STRING', 'FLOAT']

export const parser = (tokens) => {
  function match (tokenType) {
    if (tokens.get().type === 'NEWLINE') {
      cProgram += tokens.get().value + ' '
      tokens.next()
    }
    if (tokens.get().type === tokenType) tokens.next()
    else throw tokenType
  }
  function programa (tokenType) {
    tokens.next()
    match('START')
    keywords()
    match('KEYWORD')
    let reProg = beautify(cProgram, { indent_size: 2, space_in_empty_paren: true })
    reProg = cInit + reProg
    cProgram = ''
    return reProg
  }
  function keywords () {
    while (tokens.get().value !== 'end') {
      try {
        cProgram += keyword()
      } catch (e) {
        throw e
      }
    }
  }
  function keyword () {
    switch (tokens.get().value) {
      case 'function':
        return FUNCTION()
      case 'let':
        return LET()
      case '=':
        return ASSIGN()
      case 'if':
        return IF()
      case 'for':
        return FOR()
      case 'while':
        return WHILE()
      case '/':
      case '*':
      case '+':
      case '-':
      case '++':
      case '--':
      case '%':
        console.log('helo');
        return ARITHMETIC()
        break
      case 'console':
        return PRINT()
        break
      default:
        console.log(`value keyword not identified ---> ${tokens.get().value}`)
        tokens.next()
        return ''
    }
  }
  function PRINT () {
    let print = ''
    match('KEYWORD')
    match('DOT')
    print += 'printf'
    console.log(tokens.get().value)
    console.log(print)
    match('KEYWORD')
    print += tokens.get().value
    match('LEFT_PAREN')
    print += `"${tokens.get().value}"`
    match('STRING')
    print += tokens.get().value
    match('RIGHT_PAREN')
    print += ';'
    return print
  }
  function OPERATION () {
    let operationBuild = ''
    operation += tokens.prev().value
    console.log(operation)
    switch (tokens.prev().type) {
      case 'INTEGER':
        match('INTEGER')
        break
      case 'FLOAT':
        match('FLOAT')
        break
      case 'INTEGER':
        match('INTEGER')
        break
      case 'IDENTIFIER':
        match('IDENTIFIER')
        break
      default:
        console.log('Not found')
        break
    }
    operation += tokens.get().value
    ARITHMETIC()
    operation += tokens.get().value
    switch (tokens.get().type) {
      case 'INTEGER':
        MATC
        break
      case 'FLOAT':
        break
      case 'INTEGER':
        break
      case 'IDENTIFIER':
        break
      default:
        console.log('Not found')
        break
    }
    console.log(operation)
  }
  function LET () {
    let type = ''
    let value
    match('KEYWORD')
    let id = tokens.get().value
    match('IDENTIFIER')
    match('ASSIGN')
    switch (tokens.get().type) {
      case 'INTEGER':
        value = tokens.get().value
        match('INTEGER')
        type = 'int '
        break
      case 'STRING':
        id += '[]'
        value = `'${tokens.get().value}'`
        match('STRING')
        type = 'char '
        break
      case 'FLOAT':
        value = tokens.get().value
        match('FLOAT')
        type = 'float '
        break
      default:
        match('ONOou')
    }
    type = type + id + ' = ' + value + ';'
    return type
  }
  function COMPARISON () {
    let comparison = ''
    if (tokens.get().type === 'IDENTIFIER') {
      comparison += tokens.get().value
      match('IDENTIFIER')
    }

    if (tokens.get().type === 'INTEGER') {
      comparison += tokens.get().value
      match('INTEGER')
    }

    comparison += ' ' + tokens.get().value + ' '

    switch (tokens.get().value) {
      case '===':
        match('STRICT_EQ')
        break
      case '<':
        match('LT')
        break
      case '>':
        match('GT')
        break
      case '||':
        match('OR')
        break
      case '>=':
        match('GE')
        break
      case '<=':
        match('LE')
        break
      case '||':
        match('OR')
        break
      case '!==':
        match('STRICT_NE')
        break
      case '&&':
        match('AND')
        break
      default:
        console.log(`Comparison character not found -> ${tokens.get().value}`)
        // tokens.next()
    }

    if (tokens.get().type === 'IDENTIFIER') {
      comparison += tokens.get().value
      match('IDENTIFIER')
    }

    if (tokens.get().type === 'INTEGER') {
      comparison += tokens.get().value
      match('INTEGER')
    }

    return comparison
  }
  function ASSIGN () {
    let assign = ''
    let prev = tokens.prev().value
    let val
    match('ASSIGN')
    val = checkForType()
    assign += prev + ' = ' + val + ';'
    return assign
  }
  function IF () {
    let ifBuild = ''
    ifBuild += tokens.get().value
    match('KEYWORD')
    ifBuild += tokens.get().value
    match('LEFT_PAREN')
    let comparision = COMPARISON()
    ifBuild += comparision + tokens.get().value
    match('RIGHT_PAREN')
    ifBuild += tokens.get().value
    match('LEFT_CURLY')
    while (tokens.get().value !== 'return' && tokens.get().value !== '}') {
      ifBuild += keyword()
    }
    if (tokens.get().value === 'return') {
      ifBuild += tokens.get().value + ' '
      match('KEYWORD')
      ifBuild += tokens.get().value + '; '
      match('IDENTIFIER')
    }
    if (tokens.get().type === 'NEWLINE') {
      tokens.next()
    }
    ifBuild += tokens.get().value
    match('RIGHT_CURLY')
    return ifBuild
  }
  function CASE () {
    match('KEYWORD')
    match('STRING')
    match('COLON')
    keywords()
    match('KEYWORD')
  }
  function DEFAULT () {
    match('KEYWORD')
    match('COLON')
    keywords()
    match('KEYWORD')
  }
  function SWITCH () {
    match('KEYWORD')
    match('LEFT_PAREN')
    match('IDENTIFIER')
    match('RIGHT_PAREN')
    match('LEFT_CURLY')
    while (tokens.get().value !== 'default') {
      CASE()
    }
    DEFAULT()
    match('RIGHT_CURLY')
  }
  function WHILE () {
    let whileBuild = ''
    whileBuild += tokens.get().value
    match('KEYWORD')
    whileBuild += tokens.get().value
    match('LEFT_PAREN')
    let comparison = COMPARISON()
    whileBuild += comparison + tokens.get().value
    match('RIGHT_PAREN')
    whileBuild += tokens.get().value
    match('LEFT_CURLY')
    while (tokens.get().value !== 'return' && tokens.get().value !== '}') {
      whileBuild += keyword()
    }
    if (tokens.get().value === 'return') {
      whileBuild += tokens.get().value + ' '
      match('KEYWORD')
      whileBuild += tokens.get().value + '; '
      match('IDENTIFIER')
    }
    if (tokens.get().type === 'NEWLINE') {
      tokens.next()
    }
    whileBuild += tokens.get().value
    match('RIGHT_CURLY')
    return whileBuild
  }
  function FOR () {
    let forBuild = ''
    forBuild += tokens.get().value
    match('KEYWORD')
    forBuild += tokens.get().value
    match('LEFT_PAREN')
    let assign = LET()
    forBuild += assign
    match('SEMICOLON')
    let comparison = COMPARISON()
    forBuild += comparison + tokens.get().value
    match('SEMICOLON')
    forBuild += tokens.get().value
    if (tokens.get().type === 'IDENTIFIER') { match('IDENTIFIER') }
    if (tokens.get().type === 'INTEGER') { match('INTEGER') }
    if (tokens.get().type === 'FLOAT') { match('FLOAT') }

    forBuild += tokens.get().value
    ARITHMETIC()
    forBuild += tokens.get().value
    match('RIGHT_PAREN')
    forBuild += tokens.get().value
    match('LEFT_CURLY')
    while (tokens.get().value !== 'return' && tokens.get().value !== '}') {
      forBuild += keyword()
    }
    if (tokens.get().value === 'return') {
      forBuild += tokens.get().value + ' '
      match('KEYWORD')
      forBuild += tokens.get().value + '; '
      match('IDENTIFIER')
    }

    if (tokens.get().type === 'NEWLINE') {
      tokens.next()
    }
    forBuild += tokens.get().value
    match('RIGHT_CURLY')

    return forBuild
  }
  function ARITHMETIC () {
    let buildArithmetic = ' '
    buildArithmetic += tokens.prev().value
    buildArithmetic += tokens.get().value
    switch (tokens.get().value) {
      case '/':
        match('DIV')
        break
      case '*':
        match('MUL')
        break
      case '+':
        match('PLUS')
        break
      case '-':
        match('MINUS')
        break
      case '++':
        match('INCREMENT')
        break
      case '--':
        match('DECREMENT')
        break
      case '%':
        match('MOD')
        break
      default:
        console.log('Operation not found')
        break
    }
    if(tokens.get().type === 'NEWLINE')
      return buildArithmetic
    buildArithmetic += tokens.get().value
    console.log(buildArithmetic);
    return buildArithmetic
  }
  function FUNCTION () {
    let func = ''
    let type = ''
    match('KEYWORD')
    func += tokens.get().value
    match('IDENTIFIER')
    func += tokens.get().value
    match('LEFT_PAREN')
    func += tokens.get().value
    // parameters
    match('RIGHT_PAREN')
    func += tokens.get().value
    match('LEFT_CURLY')

    while (tokens.get().value !== 'return' && tokens.get().value !== '}') {
      func += keyword()
    }
    // return
    if (tokens.get().type === 'RIGHT_CURLY') {
      type = 'void '
      func = type + func
      func += tokens.get().value
    } else {
      func += tokens.get().value + ' '
      match('KEYWORD')
      console.log(tokens.get())
      if (tokens.get().type === 'INTEGER' || tokens.get().type === 'STRING' || tokens.get().type === 'FLOAT') {
        type = returnFunctionType()
        let val = checkForType() + ';'
        func += val
        // type
        if (tokens.get().type === 'NEWLINE') {
          tokens.next()
        }
        func += tokens.get().value
        func = type + func
      }
      if (tokens.get().type === 'IDENTIFIER') {
        type = 'void '
        func = type + func
        func += tokens.get().value
      }
    }

    match('RIGHT_CURLY')
    return func
  }
  function checkForType () {
    let val
    for (let i = 0; i < types.length; i++) {
      if (types[i] === tokens.get().type) {
        val = tokens.get().value
        if (types[i] === 'STRING') { val = `'${val}'` }
        match(types[i])
      }
    }
    return val
  }
  function returnFunctionType () {
    switch (tokens.get().type) {
      case 'INTEGER':
        return 'int '
      case 'STRING':
        return 'char '
      case 'FLOAT':
        return 'float '
      default:
        console.log('ONOou')
    }
  }

  return programa
}
