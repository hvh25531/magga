import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Sidebar extends Component {
  state = {
    expanded: false,
  }
  render() {
    return (
      <div id="left-sidebar">
        <div id="sidebar-head">
          <div id="logo-sidebar">
            <Link to="/">
              <img className="logo" src="/images/logo.png" alt="" />
            </Link>
          </div>
          <div
            onClick={() => this.setState({ expanded: !this.state.expanded })}
            id="toggle-menu-btn"
            className={this.state.expanded ? 'clicked' : null}
          >
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
        </div>
        <ul id="menu-sidebar" className={this.state.expanded ? 'expanded' : null}>
          <li><Link className="link" to="/">Home</Link></li>
          <li><Link className="link" to="/authors">Tác giả</Link></li>
          <li><Link className="link" to="/categories">Danh mục</Link></li>
          <li><Link className="link" to="/albums">Albums</Link></li>
          {/* <li><Link className="link" to="#">Trích dẫn</Link></li> */}
        </ul>
        <div className="footer">
          <p>Copyright 2014 Brand Exponents All Rights Reserved</p>
        </div>
      </div>
    )
  }
}