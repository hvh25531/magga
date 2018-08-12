import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { BackTop, Breadcrumb, Card, Col, Icon, Modal, Row, Switch } from 'antd'
import styled from 'styled-components'
import { NEXT, PREV } from '../../consts'
import RightSidebar from '../partials/RightSidebar'

const WrapperIcon = styled.div`
  cursor: pointer;
  width: 50px;
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: ${props => props.pos === 'right' ? 0 : 'auto'};
  background: ${props => props.pos === 'right' ? 
    'linear-gradient(to right, transparent, rgba(0, 0, 0, .5))'
    : 
    'linear-gradient(to left, transparent, rgba(0, 0, 0, .5));'
  };
`

const CenteredIcon = styled(Icon)`
  color: rgba(255, 255, 255, 0.7);
  &:hover { color: #fff; }
  font-size: 20px;
  font-weight: bold;
  margin: auto;
`

@inject('store')
@observer
export default class Album extends Component {
  constructor(props) {
    super(props)
    this.albumStore = this.props.store.albumStore
    this.state = {
      modalVisible: false,
      viewingPost: null,
      windowWidth: null,
      windowHeight: null,
      previewImg: null
    }
  }

  componentWillMount() {
    this.setState({
      windowHeight: window.innerHeight - 40,
      windowWidth: window.innerWidth
    });
    
    this.loadData(this.props)
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    this.loadData(nextProps)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  loadData = (props) => {
    const { store, match, history } = props
    const { slug } = match.params
    this.albumStore.fetchViewingAlbum(slug, history)
  }

  handleResize = () => {
    this.setState({
      windowHeight: window.innerHeight - 40,
      windowWidth: window.innerWidth
    }, () => {
      if (this.state.modalVisible) {
        this.adjustImgSize()
      }
    });
  }

  onOpenModal = (post) => {
    this.setState({
      viewingPost: post,
      previewImg: post.cover_img,
      modalVisible: true
    }, () => this.adjustImgSize())
  }

  onCancelModal = () => {
    this.setState({ modalVisible: false })
  }

  changeViewingPost = (action) => {
    const { postsInViewingAlbum: posts } = this.albumStore
    const { viewingPost } = this.state
    const postCount = posts.length
    let index = posts.findIndex(post => post.id === viewingPost.id)
    index = action === PREV ? index - 1 : index + 1
    
    if (index === -1) {
      index = postCount - 1
    }

    if (index === postCount) {
      index = 0
    }
    this.setState({
      viewingPost: posts[index],
      previewImg: posts[index].cover_img
    }, () => {
      this.adjustImgSize()
    })
  }

  adjustImgSize = () => {
    const { windowWidth, windowHeight, previewImg } = this.state
    const image = document.createElement('img')
    image.src = previewImg
    image.onload = () => {
      const colWidth = document.querySelector('.left-col').offsetWidth
      const imgHeight = image.naturalHeight
      const imgWidth = image.naturalWidth
      const modalStyle = document.querySelector('.ant-modal-body').style

      if (imgHeight > imgWidth) {
        const height = imgHeight > windowHeight ? windowHeight : imgHeight
        modalStyle.height = windowWidth >= 768 ? height + 'px' : 'auto'
        this.imgRef.height = height
        this.imgRef.width = (height / imgHeight) * imgWidth
      } else {
        //console.log(this.imgRef.height)
        const width = imgWidth > colWidth ? colWidth : imgWidth
        this.imgRef.width = width
        const height = (width / imgWidth) * imgHeight
        modalStyle.height = windowWidth >= 768 ? height + 'px' : 'auto'
        this.imgRef.height = height
      }
    }
  }

  render() {
    const { modalVisible, viewingPost, windowHeight } = this.state
    const { loadingContent, viewingAlbum, postsInViewingAlbum } = this.albumStore

    return (
      <div>
        <BackTop />
        <Row gutter={15}>
          <Col sm={24} md={18} xl={17}>
            {loadingContent ? (
              <Card loading style={{ border: 'none' }} />
            ) : (
              <section className="main-content">
                <Breadcrumb className="card">
                  <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                  <Breadcrumb.Item><Link to="/albums">Albums</Link></Breadcrumb.Item>
                  <Breadcrumb.Item>{viewingAlbum.name}</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={false} className="card">
                  <div style={{ textAlign: 'center' }}>
                    <h1>{viewingAlbum.name}</h1>
                    <p>{viewingAlbum.description}</p>
                    <p>{postsInViewingAlbum.length} post</p>
                  </div>
                  <div className="h-masonry many-size">
                    {postsInViewingAlbum.map(post => (  
                      <div
                        key={post.id}
                        onClick={() => this.onOpenModal(post)}
                        className="masonry-brick" style={{
                          background: `#fff url(${post.cover_img})`,
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center'
                        }}
                      />
                    ))}
                  </div>
                </Card>
              </section>
            )}
          </Col>
          <Col sm={24} md={6} xl={7}>
            <RightSidebar {...this.props} fromAlbumDetails />
          </Col>
        </Row>
        {modalVisible && (
          <Modal
            transitionName=''
            wrapClassName="vertical-center-modal"
            className="album-modal"
            style={{ maxHeight: windowHeight }}
            visible
            onCancel={this.onCancelModal}
            footer={null}
          >
            <Col
              sm={24}
              md={14}
              lg={17}
              className="left-col"
              style={{
                background: '#000',
                position: 'relative'
              }}
            >
              <img
                src={viewingPost.cover_img}
                ref={ref => {this.imgRef = ref}}
              />
              {postsInViewingAlbum.length > 1 && (
                <div>
                  <WrapperIcon pos="left" onClick={() => this.changeViewingPost(PREV)} >
                    <CenteredIcon type="left"/>
                  </WrapperIcon>
                  <WrapperIcon pos="right" onClick={() => this.changeViewingPost(NEXT)} >
                    <CenteredIcon type="right"/>
                  </WrapperIcon>
                </div>
              )}
            </Col>
            <Col
              sm={24}
              md={10}
              lg={7}
              className="modal-col-right"
            >
              <h2>{viewingPost.title}</h2>
              <div dangerouslySetInnerHTML={{__html: viewingPost.content}} />
            </Col>
          </Modal>
        )}
      </div>
    )
  }
}
