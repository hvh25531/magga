import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Icon, message } from 'antd'
const { SubMenu } = Menu
const { Sider } = Layout

const menuList = [
  { key: '1', name: 'Bài viết', url: "/admin/posts" },
  { key: '2', name: 'Danh mục', url: "/admin/categories" },
  { key: '3', name: 'Tác giả', url: "/admin/authors" },
  { key: '4', name: 'Album', url: "/admin/albums" },
]

export default class AdminLeftSidebar extends Component {
  state = {
    activeMenuItem: null,
    defaultOpenKeys: ['menu']
  }

  componentWillMount() {
    const { url } = this.props.match
    const activeMenuItem = menuList.filter(item => item.url === url)[0]
    this.setState({ activeMenuItem })

    if (window.innerWidth <= 767) {
      this.setState({ defaultOpenKeys: null })
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowInnerWidth)
    if (window.innerWidth <= 767) {
      this.updateWindowInnerWidth()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowInnerWidth)
  }

  updateWindowInnerWidth = () => {
    const innerWidth = window.innerWidth
    this.setState({ innerWidth })

    const siderStyle = document.getElementById('sider-admin').style
    siderStyle.width = innerWidth <= 767 ? '100%' : '200px'
    siderStyle.maxWidth = innerWidth <= 767 ? '100%' : '200px'
    siderStyle.minMidth = innerWidth <= 767 ? '100%' : '200px'
    siderStyle.flex = innerWidth <= 767 ? 'none' : '0 0 200px'

    const mainLayoutStyle = document.getElementById('main-layout-admin').style
    mainLayoutStyle.flexDirection = innerWidth <= 767 ? 'column' : 'row'
  }

  logOut = () => {
    this.props.store.authStore.logOut()
    this.props.history.replace('/admin/login')
    message.success('Logout thành công!')
  }

  render() {
    const { activeMenuItem, defaultOpenKeys } = this.state
    return (
      <Sider
        id="sider-admin"
        style={{
          background: 'transparent',
          marginRight: 10
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[activeMenuItem.key]}
          defaultOpenKeys={defaultOpenKeys}
          style={{ height: 'auto' }}
        >
          <SubMenu
            key="menu"
            title={<span><Icon type="home" />Menu</span>}
          >
            {menuList.map(({ key, name, url }) => (
              <Menu.Item key={key}><Link to={url}>{name}</Link></Menu.Item>
            ))}
          </SubMenu>
          <SubMenu key="user" title={<span><Icon type="user" />User</span>}>
            <Menu.Item key="5">Profiles</Menu.Item>
            <Menu.Item key="6" onClick={this.logOut}>Logout</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    )
  }
}
