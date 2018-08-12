import React, { Component } from 'react'

export default class Page extends Component {
  render() {
    return (
      <div className="row">
        <div className="section section-grey">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="section-title text-center">
                  <h2>Bài viết nổi bật</h2>
                </div>
              </div>
    
              <div className="col-sm-3">
                <div className="post">
                  <a className="post-img" href="blog-post.html"><img src="/img/post-4.jpg" alt="" /></a>
                  <div className="post-body">
                    <div className="post-meta">
                      <a className="post-category cat-2" href="category.html">JavaScript</a>
                      <span className="post-date">March 27, 2018</span>
                    </div>
                    <h3 className="post-title"><a href="blog-post.html">Chrome Extension Protects Against JavaScript-Based CPU Side-Channel Attacks</a></h3>
                  </div>
                </div>
              </div>

              <div className="col-sm-3">
                <div className="post">
                  <a className="post-img" href="blog-post.html"><img src="/img/post-5.jpg" alt="" /></a>
                  <div className="post-body">
                    <div className="post-meta">
                      <a className="post-category cat-3" href="category.html">Jquery</a>
                      <span className="post-date">March 27, 2018</span>
                    </div>
                    <h3 className="post-title"><a href="blog-post.html">Ask HN: Does Anybody Still Use JQuery?</a></h3>
                  </div>
                </div>
              </div>

              <div className="col-sm-3">
                <div className="post">
                  <a className="post-img" href="blog-post.html"><img src="/img/post-3.jpg" alt="" /></a>
                  <div className="post-body">
                    <div className="post-meta">
                      <a className="post-category cat-1" href="category.html">Web Design</a>
                      <span className="post-date">March 27, 2018</span>
                    </div>
                    <h3 className="post-title"><a href="blog-post.html">Pagedraw UI Builder Turns Your Website Design Mockup Into Code Automatically</a></h3>
                  </div>
                </div>
              </div>

              <div className="col-sm-3">
                <div className="post">
                  <a className="post-img" href="blog-post.html"><img src="/img/post-3.jpg" alt="" /></a>
                  <div className="post-body">
                    <div className="post-meta">
                      <a className="post-category cat-1" href="category.html">Web Design</a>
                      <span className="post-date">March 27, 2018</span>
                    </div>
                    <h3 className="post-title"><a href="blog-post.html">Pagedraw UI Builder Turns Your Website Design Mockup Into Code Automatically</a></h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-12">
                    <div className="section-title">
                      <h2>Đọc nhiều</h2>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="post post-row">
                      <a className="post-img" href="blog-post.html"><img src="/img/post-4.jpg" alt="" /></a>
                      <div className="post-body">
                        <div className="post-meta">
                          <a className="post-category cat-2" href="category.html">JavaScript</a>
                          <span className="post-date">March 27, 2018</span>
                        </div>
                        <h3 className="post-title"><a href="blog-post.html">Chrome Extension Protects Against JavaScript-Based CPU Side-Channel Attacks</a></h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="post post-row">
                      <a className="post-img" href="blog-post.html"><img src="/img/post-6.jpg" alt="" /></a>
                      <div className="post-body">
                        <div className="post-meta">
                          <a className="post-category cat-2" href="category.html">JavaScript</a>
                          <span className="post-date">March 27, 2018</span>
                        </div>
                        <h3 className="post-title"><a href="blog-post.html">Why Node.js Is The Coolest Kid On The Backend Development Block!</a></h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="post post-row">
                      <a className="post-img" href="blog-post.html"><img src="/img/post-1.jpg" alt="" /></a>
                      <div className="post-body">
                        <div className="post-meta">
                          <a className="post-category cat-4" href="category.html">Css</a>
                          <span className="post-date">March 27, 2018</span>
                        </div>
                        <h3 className="post-title"><a href="blog-post.html">CSS Float: A Tutorial</a></h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="post post-row">
                      <a className="post-img" href="blog-post.html"><img src="/img/post-2.jpg" alt="" /></a>
                      <div className="post-body">
                        <div className="post-meta">
                          <a className="post-category cat-3" href="category.html">Jquery</a>
                          <span className="post-date">March 27, 2018</span>
                        </div>
                        <h3 className="post-title"><a href="blog-post.html">Ask HN: Does Anybody Still Use JQuery?</a></h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-12">
                    <div className="section-row">
                      <button className="primary-button center-block">Load More</button>
                    </div>
                  </div>
                </div>
              </div>
    
              <div className="col-md-4">
                <div className="aside-widget">
                  <div className="section-title">
                    <h2>Tags</h2>
                  </div>
                  <div className="tags-widget">
                    <ul>
                      <li><a href="#">Chrome</a></li>
                      <li><a href="#">CSS</a></li>
                      <li><a href="#">Tutorial</a></li>
                      <li><a href="#">Backend</a></li>
                      <li><a href="#">JQuery</a></li>
                      <li><a href="#">Design</a></li>
                      <li><a href="#">Development</a></li>
                      <li><a href="#">JavaScript</a></li>
                      <li><a href="#">Website</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
