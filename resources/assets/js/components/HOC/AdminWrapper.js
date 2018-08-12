import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Layout, BackTop } from 'antd'
import 'antd/dist/antd.css'
import { checkToken } from '../../utils'
import AdminLeftSidebar from '../partials/AdminLeftSidebar'
const { Content, Footer } = Layout

export default (AdminComponent) => (
  @inject('store')
  @observer
  class extends Component {
    constructor(props) {
      super(props)
      this.authStore = this.props.store.authStore
    }

    componentWillMount() {
      checkToken((token, expires_in) => {
        this.authStore.initState(token, expires_in)
      })
    }

    render() {
      const { token } = this.authStore
      return !token ? (
        <Redirect
          to={{
            pathname: '/admin/login',
            state: { ...this.props.location }
          }}
        />
      ) : (
        <Layout>
          <Content style={{ padding: '0 30px' }}>
            <Layout
              id="main-layout-admin"
              style={{ padding: '24px 0' }}
            >
              <AdminLeftSidebar {...this.props} />
              
              <Content
                style={{
                  padding: '20px 24px',
                  minHeight: 384,
                  background: '#fff'
                }}
              >
                <AdminComponent {...this.props} />
              </Content>
            </Layout>
          </Content>

          <Footer style={{ textAlign: 'center' }}>
            Admin Panel ©2018 Created by Kin
          </Footer>
          <BackTop />
        </Layout>
      )
    }
  }
)
