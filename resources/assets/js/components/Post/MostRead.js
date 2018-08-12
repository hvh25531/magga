import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class MostRead extends Component {
  render() {
    return (
      <div className="col-md-12">
        <div className="post post-row">
          <Link className="post-img" to={`/posts/123`}><img src="./img/post-4.jpg" alt=""/></Link>
          <div className="post-body">
            <div className="post-meta">
              <Link className="post-category cat-2" to="category.html">JavaScript</Link>
              <span className="post-date">March 27, 2018</span>
            </div>
            <h3 className="post-title"><Link to={`/posts/123`}>Chrome Extension Protects Against JavaScript-Based CPU Side-Channel Attacks</Link></h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...</p>
          </div>
        </div>
      </div>
    )
  }
}
