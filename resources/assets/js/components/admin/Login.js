import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd'
import styled from 'styled-components'
import axios from 'axios'
import { checkBgLoaded, checkToken } from '../../utils'
import { LOGIN, REGISTER } from '../../consts'
import './styles.css'
const FormItem = Form.Item


const Div = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(/bg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
`

const StyledForm = styled(Form)`
  padding: 20px !important;
  width: 280px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.2);
  -webkit-transform: translate(-50%, -50%);
  -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
`

@inject('store')
class NormalLoginForm extends Component {
  constructor(props) {
    super(props)
    this.authStore = this.props.store.authStore
    this.state = {
      bgLoaded: false,
      submitting: false,
      action: LOGIN
    }
  }

  componentDidMount() {
    checkBgLoaded(document.getElementById('login-form'), () => {
      this.setState({ bgLoaded: true })
    })
  }

  componentWillMount() {
    checkToken(async (oldToken, expires_in) => {
      await this.authStore.initState(oldToken, expires_in)
      const { token } = this.authStore
      if (token) {
        this.redirect(false)
      }
    })
  }

  changeAction = (action) => {
    this.setState({ action })
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ submitting: true })

        const { action } = this.state
        const url = action === LOGIN ? '/auth/login' : '/auth/register'

        axios.post(url, values)
        .then(async res => {
          const { token, expires_in } = res.data
          if(token) {
            await this.authStore.loggedIn(token, expires_in)
            this.setState({ submitting: false })
            this.redirect()
          }
        })
        .catch(() => {
          this.setState({ submitting: false })
        })
      }
    })
  }

  redirect = async (alert = true) => {
    const { history } = this.props
    const { state } = history.location
    const { action } = this.state

    if (alert) {
      if (action === LOGIN) {
        message.success('Login thành công!')
      } else {

        await message.success('Đăng ký thành công!', 1)
        await message.loading('Hệ thống sẽ tự động chuyển đến trang quản trị trong chốc lát!', 3)
      }

      if (state) {
        history.push(state.pathname)
      } else {
        history.push('/admin/posts')
      }
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { action, bgLoaded, submitting } = this.state
    return (
      <Div id="login-form">
        {bgLoaded && (
          <StyledForm>
            {action === REGISTER && (
              <FormItem>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Please input your name!' }],
                })(
                  <Input prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Name" />
                )}
              </FormItem>
            )}

            <FormItem>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input your email!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
              )}
            </FormItem>
            
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </FormItem>

            {action === REGISTER && (
              <FormItem>
                {getFieldDecorator('rePassword', {
                  rules: [{ required: true, message: 'Please re-input your Password!' }],
                })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Re-Password" />
                )}
              </FormItem>
            )}

            <div>
              <Button
                loading={submitting}
                type="primary"
                className="login-form-button"
                onClick={this.handleSubmit}
              >
                {action === LOGIN ? 'Log in' : 'Register'}
              </Button>

              <a style={{ marginLeft: 10 }} href="">Forgot password?</a>
              <br /><br />

              {action === LOGIN ? (
                <p>
                  <span style={{ color: '#fff' }}>Or </span>
                  <a href="javascript:" onClick={() => this.changeAction(REGISTER)}>register now!</a>
                </p>
              ) : (
                <a href="javascript:" onClick={() => this.changeAction(LOGIN)}>Login now</a>
              )}
            </div>
          </StyledForm>
        )}
      </Div>
    )
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm)

export default WrappedNormalLoginForm