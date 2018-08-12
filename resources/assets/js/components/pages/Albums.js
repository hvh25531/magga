import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import { BackTop, Breadcrumb, Card, Col, List, Row } from 'antd'
import LeftSidebar from '../partials/LeftSidebar'
import RightSidebar from '../partials/RightSidebar'
import '../admin/styles.css'
const { Meta } = Card

const AlbumCard = styled.div`
  height: 220px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

@inject('store')
@observer
export default class Albums extends Component {
  constructor(props) {
    super(props);
    this.albumStore = this.props.store.albumStore
  }
  componentDidMount() {
    this.loadData()
  }

  componentWillReceiveProps() {
    this.loadData()
  }

  loadData = () => {
    const { pathname, search } = this.props.history.location
    const { updateUrl } = this.albumStore
    const url = pathname + search
    updateUrl(url, search)
  }

  pageChanged = async (currentPage) => {
    const { history } = this.props
    const { pageChanged } = this.albumStore
    await pageChanged(currentPage)
    const { url } = this.albumStore
    history.push(url)
  }

  render() {
    const {
      albums,
      featured,
      categories,
      currentPage,
      loadingContent,
      loadingSidebar,
      totalAlbums
    } = this.albumStore;
    const { match } = this.props
    return (
      <div id="albums">
        <BackTop />
        <Row gutter={15}>
          <Col sm={24} md={6} xl={5}>
            {loadingSidebar ? (
              <Card loading style={{ border: 'none' }} />
            ) : (
              <LeftSidebar
                {...this.props}
                categories={categories}
                featured={featured}
                fromAlbums
              />
            )}
          </Col>
          <Col sm={24} md={12} xl={12}>
            {loadingContent ? (
              <Card loading style={{ border: 'none' }} />
            ) : (
              <section className="main-content">
                <Breadcrumb className="card">
                  <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                  <Breadcrumb.Item>Albums</Breadcrumb.Item>
                </Breadcrumb>
                <List
                  className="albums-list"
                  grid={{ gutter: 16 }}
                  pagination={totalAlbums <= 10 ? false : {
                    current: currentPage,
                    total: totalAlbums,
                    pageSize: 10,
                    onChange: this.pageChanged,
                    style: {
                      marginTop: 10,
                      marginBottom: 10,
                      textAlign: 'right'
                    }
                  }}
                  dataSource={albums}
                  renderItem={(album) => {
                    return (
                      <Col
                        xs={12}
                        style={{ height: 220, marginBottom: 20, position: 'relative' }}
                      >
                        <Card
                          className="card-album"
                          hoverable
                          cover={(
                            <Link to={`${match.url}/${album.slug}`}>
                              <AlbumCard style={{ backgroundImage: `url("${album.cover}")` }} />
                            </Link>
                          )}
                        >
                          <Link to={`${match.url}/${album.slug}`}>
                            <Meta title={album.name} description={`${album.posts_count} bài viết`} />
                          </Link>
                        </Card>
                      </Col>
                    )
                  }}
                />
              </section>
            )}
          </Col>
          <Col sm={24} md={6} xl={7}>
            {loadingSidebar ? (
              <Card loading style={{ border: 'none' }} />
            ) : (
              <RightSidebar {...this.props} fromAlbums />
            )}
          </Col>
        </Row>
      </div>
    )
  }
}
