import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Card, Col, List, Row } from 'antd'
const { Meta } = Card

const AlbumThumbnail = styled(Link)`
  display: block;
  height: 100px;
  background: #fff url(${props => props['data-img']}) center center / cover;
`
const AlbumInfo = styled.div``
const AlbumTitle = styled.div`
  display: -moz-box;
  display: -webkit-box;
  display: box;
  -webkit-line-clamp: 2;
  -moz-box-orient: vertical!important;
  -webkit-box-orient: vertical!important;
  box-orient: vertical!important;
  overflow: hidden;
  word-break: break-word;

  a {
    font-size: 13px;
    font-weight: 600;
    color: #000;

    &:focus, &:hover {
      color: #e70000;
    }
  }
`
const AlbumMetaData = styled.div`
  color: #8590a6;
  font-size: 11px;
`

const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 0 12px;
  }
`

@observer
export default class RightSidebar extends Component {
  render() {
    const { fromAlbums, fromAlbumDetails, fromHome, fromPosts, fromPostDetails } = this.props
    const { featured: featuredPosts, relatedPosts } = this.props.store.postStore
    const { featured: featuredAlbums, relatedAlbums } = this.props.store.albumStore
    return (
      <section id="right-sidebar">
        {/* <Card
          className="card"
          hoverable
          bordered={false}
          cover={
            <img src="/images/IMG_0326.JPG" />
          }
        >
          <Meta
            description="Tổng hợp các tài liệu về..."
          />
        </Card> */}
        {(fromAlbums || fromHome) && (
          <Card
            className="card"
            title="Albums nổi bật"
            bordered={false}
          >
            <Row gutter={10}>
              {featuredAlbums.map(({ id, cover, name, slug, posts_count }) => (
                <Col sm={12} key={id}>
                  <AlbumThumbnail data-img={cover} to={`/albums/${slug}`}/>
                  <AlbumInfo>
                    <AlbumTitle>
                      <Link to={`/albums/${slug}`}>{name}</Link>
                    </AlbumTitle>
                    <AlbumMetaData>{posts_count} bài viết</AlbumMetaData>
                  </AlbumInfo>
                </Col>
              ))}
            </Row>
          </Card>
        )}
        {(fromPosts || fromHome) && (
          <StyledCard
            className="card"
            title="Bài nổi bật"
            bordered={false}
          >
            <List
              size="small"
              dataSource={featuredPosts}
              renderItem={({ id, slug, title }) => (
                <List.Item><Link to={`/posts/${slug}`} key={id}>{title}</Link></List.Item>
              )}
            />
          </StyledCard>
        )}
        {fromPostDetails && (
          <StyledCard
            className="card"
            title="Bài liên quan"
            bordered={false}
          >
            <List
              size="small"
              dataSource={relatedPosts}
              renderItem={({ id, slug, title }) => (
                <List.Item><Link to={`/posts/${slug}`} key={id}>{title}</Link></List.Item>
              )}
            />
          </StyledCard>
        )}
        {fromAlbumDetails && (
          <Card
            className="card"
            title="Albums liên quan"
            bordered={false}
          >
            <Row gutter={10}>
              {relatedAlbums.map(({ id, cover, name, slug, posts_count }) => (
                <Col sm={12} key={id}>
                  <AlbumThumbnail data-img={cover} to={`/albums/${slug}`}/>
                  <AlbumInfo>
                    <AlbumTitle>
                      <Link to={`/albums/${slug}`}>{name}</Link>
                    </AlbumTitle>
                    <AlbumMetaData>{posts_count} bài viết</AlbumMetaData>
                  </AlbumInfo>
                </Col>
              ))}
            </Row>
          </Card>
        )}
      </section>
    )
  }
}