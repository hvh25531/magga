import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import { Affix, Button, Icon, Menu } from 'antd'
import { hasCategoryParamInUrl } from '../../utils'

const StyledMenu = styled(Menu)`
  background: none !important;
  border-right: 0 !important;
  li {
    height: 34px !important;
    line-height: 34px !important;
    margin: 0 0 4px !important;
  }
`

const CustomBadge = styled.span`
  font-size: 12px;
  position: absolute;
  right: 10px;
`

export default class LeftSidebar extends Component {
  state = {
    current: '',
    windowWidth: null,
    sidebarVisible: false
  }

  componentWillMount() {
    const { search } = this.props.location
    const categoryMatched = hasCategoryParamInUrl(search)
    if (categoryMatched) {
      this.setState({ current: categoryMatched[2] })
    }
    this.setState({ windowWidth: window.innerWidth })
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ windowWidth: window.innerWidth })
  }

  changeCurrentKey = (e) => {
    this.setState({ current: e.key })
  }

  hideSidebar = () => {
    this.setState({ sidebarVisible: false })
  }
  
  showSidebar = () => {
    this.setState({ sidebarVisible: true })
  }
  
  render() {
    const { categories, fromAlbums, fromPosts } = this.props
    const { current, windowWidth, sidebarVisible } = this.state
    const Sidebar = (
      <section id="left-sidebar">
        <div className="sidebar-nav">
          <h4>Theo danh mục</h4>
          <StyledMenu
            mode="inline"
            onClick={this.changeCurrentKey}
            selectedKeys={[current]}
          >
            {categories.map(cat => (
              <Menu.Item key={cat.slug}>
                <Link to={`?category=${cat.slug}`}>
                  {cat.name}
                  {fromPosts && (
                    <CustomBadge>{cat.posts_count}</CustomBadge>
                  )}
                  {fromAlbums && (
                    <CustomBadge>{cat.albums_count}</CustomBadge>
                  )}
                </Link>
              </Menu.Item>
            ))}
          </StyledMenu>
        </div>
      </section>
    )
    
    return (
      <Affix offsetTop={68}>
        {windowWidth <= 767  ? (
          sidebarVisible ? (
            <div>
              <Button className="toggle-left-sidebar-btn" type="primary" onClick={this.hideSidebar}>
                <Icon type="menu-fold" />
              </Button>
              {Sidebar}
            </div>
          ) : (
            <Button className="toggle-left-sidebar-btn" type="primary" onClick={this.showSidebar}>
              <Icon type="menu-unfold" />
            </Button>
          )
        ) : Sidebar}
      </Affix>
    )
  }
}
