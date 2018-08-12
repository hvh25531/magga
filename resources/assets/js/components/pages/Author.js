import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Card, Col, Collapse, List } from 'antd'
import styled from 'styled-components'
import '../admin/styles.css'
const Panel = Collapse.Panel
const { Meta } = Card

const StyledList = styled(List)`
  margin-bottom: 10px !important;
  padding: 0 15px !important;
  -webkit-column-count: 2;
  -moz-column-count: 2;
  column-count: 2;
  -webkit-column-gap: 40px;
  -moz-column-gap: 40px;
  column-gap: 40px;

  .ant-list-empty-text {
    padding-left: 0;
    text-align: left;
  }
`

const StyledListTitle = styled.h3`
  font-size: 1.5em;
  margin: 16px 0 0;
  -webkit-column-span: all;
  column-span: all;
`

const StyledPanel = styled(Panel)`
  background: #f7f7f7;
  border-radius: 4px;
  margin-bottom: 24px;
  border: 0;
  overflow: hidden;
`

const StyledImg = styled.img`
  width: 400px;
  display: block;
  margin: 0 auto 15px;
`

const Div = styled.div`
  height: 150px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

const paginationStyles = {
  marginTop: 10,
  marginBottom: 10
}

@inject('store')
@observer
export default class Authors extends Component {
  componentWillMount() {
    const { store, match } = this.props
    const { slug } = match.params
    store.authorStore.fetchAuthorDetails(slug)
  }

  pageAlbumChanged = (currentPage) => {
    const { pageAlbumInAuthorChanged: pageChanged } = this.props.store.authorStore
    pageChanged(currentPage)
  }

  pagePostChanged = (currentPage) => {
    const { pagePostInAuthorChanged: pageChanged } = this.props.store.authorStore
    pageChanged(currentPage)
  }
  
  render() {
    const {
      authorDetails: author,
      loadingAuthorDetails,
      loadingAlbums,
      loadingPosts,
      currentPostPage,
      currentAlbumPage
    } = this.props.store.authorStore
    return loadingAuthorDetails ? (
      <Card loading style={{ border: 'none' }} />
    ) : (
      <section className="main-content">
        <Breadcrumb className="card">
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/authors">Tác giả</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{author.name}</Breadcrumb.Item>
        </Breadcrumb>
        <article className="card">
          <StyledImg src={author.avatar} />
          <Collapse bordered={false} defaultActiveKey={['1']}>
            <StyledPanel header={<h3>Đôi nét về tác giả</h3>} key="1">
              <div dangerouslySetInnerHTML={{__html: author.about}} />
            </StyledPanel>
          </Collapse>
          <StyledList
            className="albums-list"
            locale={{ emptyText: 'Không có album' }}
            header={
              <div>
                <StyledListTitle>Album:</StyledListTitle>
              </div>
            }
            pagination={author.albums_count <= 10 ? false : {
              current: currentAlbumPage,
              total: author.albums_count,
              pageSize: 10,
              onChange: this.pageAlbumChanged,
              style: paginationStyles
            }}
            dataSource={author.albums}
            renderItem={album => (
              <List.Item>
                <Link to={'/albums/' + album.slug}>
                  {album.name} ({album.posts_count} bài viết)
                </Link>
              </List.Item>
            )}
          />
          <StyledList
            locale={{ emptyText: 'Không có bài viết' }}
            header={
              <div>
                <StyledListTitle>Bài viết:</StyledListTitle>
              </div>
            }
            pagination={author.posts_count <= 10 ? false : {
              current: currentPostPage,
              total: author.posts_count,
              pageSize: 10,
              onChange: this.pagePostChanged,
              style: paginationStyles
            }}
            dataSource={author.posts}
            renderItem={post => (
              <List.Item>
                <Link to={'/posts/' + post.slug}>{post.title}</Link>
              </List.Item>
            )}
          />
        </article>
      </section>
    )
  }
}
