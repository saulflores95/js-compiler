let cProgram = ''
let cInit = '#include <stdio.h>\n#include <stdlib.h>\n'
let beautify = require('js-beautify').js

export const parser = (tokens) => {
  function match (tokenType) {
    if (tokens.get().type === tokenType) tokens.next()
    else throw tokenType
  }
  function programa (tokenType) {
    tokens.next()
    match('START')
    cProgram += 'int main() {\n'

    LET()
    LET()
    keywords()

    tokens.next()
    match('KEYWORD')
    cProgram += 'return 0;\n}'
    let reProg = beautify(cProgram, { indent_size: 2, space_in_empty_paren: true })
    reProg = cInit + reProg
    cProgram = ''
    return reProg
  }
  function declaraciones () {
    console.log('Declaraciones')
  }
  function keywords () {
    while (!tokens.get().type === 'RIGHT_CURLY') {
      if (tokens.get().type === 'NEWLINE') {
        cProgram += tokens.get().value
        tokens.next()
      }
      if (tokens.get().type === 'END') { return }
      try {
        keyword()
      } catch (e) {
        throw e
      }
    }
  }
  function keyword () {
    switch (tokens.get().value) {
      case 'for':
        FOR()
        break
      case 'if':
        IF()
        break
      case 'while':
        WHILE()
        break
      case 'case':
        SWITCH()
        break
      case 'declare':
        SWITCH()
        break
      default:
        console.log('value keyword not identified')
    }
  }
  function LET() {
    let type = ''
    if(tokens.get().type === 'NEWLINE')
      tokens.next()
    match("KEYWORD")
    let id = tokens.get().value
    match("IDENTIFIER")
    match("ASSIGN")
    switch (tokens.get().type) {
      case 'INTEGER':
        value = tokens.get().value
        match('INTEGER')
        type = 'int '
        break;
      case 'STRING':
        value = tokens.get().value
        match('STRING')
        type = 'char[] '
        break;
      case 'FLOAT':
        value = tokens.get().value
        match('FLOAT')
        type = 'float '
        break
      default:
        match('ONOou')
    }
    type = type + id + " = " + value + ";"
    cProgram += type
  }
  function value() {

  }
  function comparison () {

  }
  function IF () {
    match('KEYWORD')
    match('LEFT_PAREN')
    comparison()
    match('RIGHT_PAREN')
    match('LEFT_CURLY')
    keywords()
    // match('LEFT_CURLY')
    // match('KEYWORD')
    // match('RIGHT_CURLY')
    // keywords()
    match('RIGHT_CURLY')
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
    match('KEYWORD')
    match('LEFT_PAREN')
    comparison()
    match('RIGHT_PAREN')
    match('LEFT_CURLY')
    keywords()
    match('RIGHT_CURLY')
  }
  function FOR () {
    console.log('FOR')
  }

  return programa
}
