import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { inject } from 'mobx-react'
import { Affix, Menu, Icon, Switch } from 'antd'
import styled from 'styled-components'

const MenuWrapper = styled.div`
  background: #fff;
  ul.ant-menu {
    max-width: 1024px;
    margin: auto;

    li:first-child {
      padding-left: 0;
    }
  }
`

@inject('store')
export default class TopNavigation extends Component {
  state = {
    current: 'posts',
  }

  componentWillMount() {
    const { pathname } = this.props.location
    let current = pathname.split('/')[1]
    current = current === '' ? 'home' : current
    this.setState({ current })
  }

  changeCurrentKey = (e) => {
    this.setState({ current: e.key })
  }

  render() {
    return (
      <Affix>
        <MenuWrapper>
          <Menu
            onClick={this.changeCurrentKey}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="home">
              <Link to="/"><Icon type="home" />Home</Link>
            </Menu.Item>
            <Menu.Item key="posts">
              <Link to="/posts"><Icon type="home" />Bài viết</Link>
            </Menu.Item>
            <Menu.Item key="albums">
              <Link to="/albums"><Icon type="home" />Albums</Link>
            </Menu.Item>
            <Menu.Item key="authors">
              <Link to="/authors"><Icon type="team" />Tác giả</Link>
            </Menu.Item>
          </Menu>
        </MenuWrapper>
      </Affix>
    )
  }
}
