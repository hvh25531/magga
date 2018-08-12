import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import { BackTop, Breadcrumb, Card, Col, Icon, List, Row, Tag } from 'antd'
import LeftSidebar from '../partials/LeftSidebar'
import RightSidebar from '../partials/RightSidebar'
//import RightSidebar from '../partials/RightSidebar'
import { strip } from '../../utils'

/* const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
) */

const StyledCol = styled(Col)`
  margin-bottom: 20px;
`

const CenterImg = styled.img`
  display: block;
  margin: auto;
`

@inject('store')
@observer
export default class Posts extends Component {
  constructor(props) {
    super(props);
    this.postStore = this.props.store.postStore
  }

  componentDidMount() {
    this.loadData()
  }

  componentWillReceiveProps() {
    this.loadData()
  }

  loadData = () => {
    const { pathname, search } = this.props.history.location
    const { updateUrl } = this.postStore
    const url = pathname + search
    updateUrl(url, search)
  }

  pageChanged = async (currentPage) => {
    const { history } = this.props
    const { pageChanged } = this.postStore
    await pageChanged(currentPage)
    const { url } = this.postStore
    history.push(url)
  }

  render() {
    const {
      posts,
      featured,
      categories,
      currentPage,
      loadingContent,
      loadingSidebar,
      totalPosts
    } = this.postStore
    const { match } = this.props
    return (
      <div id="page-posts">
        <BackTop />
        <Row gutter={15}>
          <StyledCol sm={24} md={6} xl={5}>
            {loadingSidebar ? (
              <Card loading style={{ border: 'none' }} />
            ) : (
              <LeftSidebar
                {...this.props}
                categories={categories}
                featured={featured}
                fromPosts
              />
            )}
          </StyledCol>
          <StyledCol sm={24} md={12} xl={12}>
            {loadingContent ? (
              <Card loading style={{ border: 'none' }} />
            ) : (
              <section className="main-content">
                <Breadcrumb className="card">
                  <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                  <Breadcrumb.Item>Bài viết</Breadcrumb.Item>
                </Breadcrumb>
                <List
                  locale={{ emptyText: 'Không có bài viết' }}
                  itemLayout="vertical"
                  size="large"
                  pagination={totalPosts <= 10 ? false : {
                    current: currentPage,
                    total: totalPosts,
                    pageSize: 10,
                    onChange: this.pageChanged,
                    style: {
                      marginTop: 10,
                      marginBottom: 10,
                      textAlign: 'right'
                    }
                  }}
                  dataSource={posts}
                  renderItem={({
                    id,
                    title,
                    slug,
                    content,
                    cover_img,
                    author,
                    category,
                    tags,
                    created_at
                  }) => {
                    const text = strip(content)

                    const _content =
                      text.length > 500 ? `${text.slice(0, 500)}...` : text

                    const _author = author ? (
                      <p>
                        Tác giả:&nbsp;
                        <Link to={`${match.url}?author=${author.slug}`}>
                          {author.name}
                        </Link>
                      </p>
                    ) : null

                    const _category = category ? (
                      <p>
                        Danh mục:&nbsp;
                        <Link to={`${match.url}?category=${category.slug}`}>
                          {category.name}
                        </Link>
                      </p>
                    ) : null

                    const _tags =
                      tags.length > 0 ? (
                        <div>
                          <Icon type="tag-o" style={{ marginRight: 5 }} />
                          {tags.map((tag, i) => (
                            <Tag key={i}>
                              <Link to={`${match.url}?tag=${tag}`}>{tag}</Link>
                            </Tag>
                          ))}
                        </div>
                      ) : null

                    return (
                      <article className="card">
                        <Row gutter={20}>
                          <StyledCol md={24}>
                            <h5 className="post-title"><Link to={`${match.url}/${slug}`}>{title}</Link></h5>
                            <p className="post-content">{_content}</p>
                            {_author}
                            {_category}
                            <p><Icon type="clock-circle-o" /> {created_at}</p>
                            {_tags}
                          </StyledCol>
                          <StyledCol md={24}>
                            <CenterImg src={cover_img} />
                          </StyledCol>
                        </Row>
                      </article>
                    )
                  }}
                />
              </section>
            )}
          </StyledCol>
          <StyledCol sm={24} md={6} xl={7}>
            {loadingSidebar ? (
              <Card loading style={{ border: 'none' }} />
            ) : (
              <RightSidebar
                {...this.props}
                categories={categories}
                featured={featured}
                fromPosts
              />
            )}
          </StyledCol>
        </Row>
      </div>
    )
  }
}
