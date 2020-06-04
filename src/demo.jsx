import React, { Component } from 'react'
import { Form, Button } from "igroot";
import Example from './ZeusSelect'

const { Item } = Form

class _FromDemo extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) return
      console.log(values)
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <Item>
          {getFieldDecorator('domains')(
            <Example mode="multiple" type="domain" keyword="name" msg="选择域名" width={180} />
          )}
        </Item>
        <Button type="primary" htmlType="submit">查询</Button>
      </Form>
    )
  }
}
const FromDemo = Form.create()(_FromDemo)

export default () => <FromDemo />