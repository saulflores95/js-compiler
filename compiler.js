const tokenizer = require('./tokenizer')
const parser = require('./parser')
const transformer = require('./transformer')
const codeGen = require('./code-gen')
/*
Flow de compilacion
  Metodologia:
    1. input → tokenizer → tokens
    2. tokens → parser → ast
    3. ast → tranformer → newAst
    4. newAst → generator → output
*/
const compiler = (input) => {
  let tokens = tokenizer(input)
  let ast = parser(tokens)
  let newAst = transformer(ast)
  let output = codeGen(newAst)
  console.log('OUTPUT = ', output)
  return output
}

module.exports = compiler
