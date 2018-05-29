import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { Container, Row, Col } from 'react-grid-system'
import tokenizer from '../../utils/tokenizer'

const TextEditor = dynamic(import('../components/textEditor'), {
  ssr: false
})

const Button = dynamic(import('../components/button'), {
  ssr: false
})

export default class Compiler extends Component {
  state = {
    input: '',
    show: false
  }

  onChange = (value) => {
    console.log(value)
  }

  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col md={6}>
              <TextEditor onChange={this.onChange} lan='javascript' theme="twilight"/>
              </Col>
            <Col md={6}>
              <TextEditor onChange={null} lan='c_cpp' theme="xcode"/>
            </Col>
          </Row>
        </Container>
          <Button />
       </div>
    )
  }
}
