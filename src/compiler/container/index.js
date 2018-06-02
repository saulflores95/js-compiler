import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { Container, Row, Col } from 'react-grid-system'
import { tokenizer, parser } from '../../utils/'
import { beautify } from 'js-beautify'

const TextEditor = dynamic(import('../components/textEditor'), {
  ssr: false
})

const Button = dynamic(import('../components/button'), {
  ssr: false
})

export default class Compiler extends Component {
  state = {
    value: '',
    show: false,
    traduction: ''
  }

  componentDidMount() {
    let sampleCode = `start
  function main() {
      let b = 0.0
      for(let i = 0; i < 5; i++) {
          if(i === 3) {
              b = 5.5
          }
      }
  }

  function ageGet() {
      console.log("What is the age of the user")
      return 13
  }

  function whatIsName() {
      console.log("What is the username")
      return "Saul"
  }

  function sub() {
      let a = 50
      let b = 3
      while(a > b) {
          console.log("a")
          a - b
      }
  }
end
    `
    this.setState({
      value: sampleCode
    })
  }

  onChange = (value) => {
    console.log('Current value', value)
    this.handleInput(value)
  }

  handleCode = (value) => {
    this.setState({
      value
    })
  }

  handleInput = () => {
    console.log(this.state.value);
    let tokens = tokenizer(this.state.value, 4)
    console.log(tokens.all())
    let parse = parser(tokens)
    let traduction = parse()
    //beautify(traduction, { indent_size:2 })
    this.setState({
      traduction
    })
  }

  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col md={6}>
              <TextEditor value={this.state.value} onChange={this.handleCode} lan='javascript' theme="twilight"/>
              </Col>
            <Col md={6}>
              <TextEditor value={this.state.traduction} onChange={null} lan='c_cpp' theme="xcode"/>
            </Col>
          </Row>
        </Container>
          <Button handleClick={this.handleInput}/>
       </div>
    )
  }
}
