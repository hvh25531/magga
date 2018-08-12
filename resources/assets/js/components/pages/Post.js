import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { BackTop, Breadcrumb, Card, Col, Icon, Row } from 'antd'
import styled from 'styled-components'
import _ from 'lodash'
import RightSidebar from '../partials/RightSidebar'

const StyledP = styled.p`
  color: rgba(0, 0, 0, 0.45);
`

const BackButton = styled.a`
  color: rgba(0, 0, 0, 0.65);
  position: relative;
  top: -10px;
  left: -5px;
  font-size: 15px;
`

@inject('store')
@observer
export default class Post extends Component {
  componentWillMount() {
    this.loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.loadData(nextProps)
  }

  loadData = (props) => {
    const { store, match, history } = props
    const { slug } = match.params
    store.postStore.fetchViewingPost(slug, history)
  }

  goBack = () => {
    console.log(this.props)
  }

  render() {
    const { viewingPost: post } = this.props.store.postStore
    //const { cover_img, title, created_at, tags, content } = this.props.store.postStore.viewingPost
    const _tags =
      post && post.tags.length > 0 ? (
        <p>
          <Icon type="tag-o" style={{ marginRight: 5 }} />
          {post.tags.map((tag, i) => (
            <Link key={i} to={`/posts?tag=${tag}`}>
              {tag}
              {i !== post.tags.length - 1 ? ', ' : null}
            </Link>
          ))}
        </p>
      ) : null
    
    const _author = post && post.author ? (
      <StyledP>
        Tác giả:&nbsp;
        <Link to={`/posts?author=${post.author.slug}`}>
          {post.author.name}
        </Link>
      </StyledP>
    ) : null

    const _category = post && post.category ? (
      <StyledP>
        Danh mục:&nbsp;
        <Link to={`/posts?category=${post.category.slug}`}>
          {post.category.name}
        </Link>
      </StyledP>
    ) : null

    return (
      <div>
        <BackTop />
        <Row gutter={15}>
          <Col sm={24} md={18} xl={17}>
            {!post ? (
              <Card loading style={{ border: 'none' }} />
            ) : (
              <section className="main-content">
                <Breadcrumb className="card">
                  <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                  <Breadcrumb.Item><Link to="/posts">Bài viết</Link></Breadcrumb.Item>
                  <Breadcrumb.Item>{post.title}</Breadcrumb.Item>
                </Breadcrumb>
                <article className="card">
                  <h1>{post.title}</h1>
                  {post.cover_img ? (
                    <img src={post.cover_img} style={{ display: 'block', margin: 'auto' }} />
                  ) : null}
                  {_author}
                  {_category}
                  <StyledP>
                    <Icon type="clock-circle-o" /> {post.created_at}
                  </StyledP>
                  {_tags}
                  <div dangerouslySetInnerHTML={{__html: post.content}} />
                </article>
              </section>
            )}
          </Col>
          <Col sm={24} md={6} xl={7}>
            <RightSidebar {...this.props} fromPostDetails />
          </Col>
        </Row>
      </div>
    )
  }
}
