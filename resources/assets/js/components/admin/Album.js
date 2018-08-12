import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { Button, Card, Form, Icon, List, Modal, Tooltip, Row, Col, Menu, Dropdown } from 'antd'
import { getBase64, strip } from '../../utils'
import ModalAlbum from './ModalAlbum'
import './styles.css'
const { Meta } = Card
const confirm = Modal.confirm

@inject('store')
@observer
class Album extends Component {
  constructor(props) {
    super(props)
    this.priAlbumStore = this.props.store.priAlbumStore
  }

  componentDidMount() {
    this.priAlbumStore.fetch()
  }

  handleImgPreview = (id) => {
    let image = document.querySelector(`div[data-id="${id}"]`).style['background-image']
    image = image.replace(/url\("(.*?)"\)/i, '$1')
    this.priAlbumStore.handleImgPreview(image)
  }

  handleUpload = (file, id) => {
    getBase64(file, imageUrl => {
      document.querySelector(`img[data-id="${id}"]`).src = imageUrl
    });
  }

  onCreate = async () => {
    await this.priAlbumStore.onCreate()
    document.getElementsByTagName('input')[1].focus()
  }

  showDeleteConfirm = (id) => {
    const { onDeleteConfirm, onDelete, onDeleteCancel } = this.priAlbumStore
    onDeleteConfirm(id)

    confirm({
      title: 'Xoá album?',
      content: (
        <p>
          Việc xoá album này sẽ <b>xoá tất cả bài viết</b> thuộc album.<br /><br />
          Bạn có chắc muốn xoá album này?
        </p>
      ),
      okText: 'Xoá',
      cancelText: 'Huỷ',
      maskClosable: true,
      onOk: onDelete,
      onCancel: onDeleteCancel,
    });
  }

  render() {
    const {
      albums,
      editingAlbum,
      loading,
      modalVisible,
      onEdit,
      onSave,
      onCancel,
      saving
    } = this.priAlbumStore;
    return (
      <div id="albums" style={{ maxWidth: 850 }}>
        <Button onClick={this.onCreate} type="primary" style={{ marginBottom: 16 }}>
          Thêm album
        </Button>
        <List
          loading={loading}
          grid={{ gutter: 16 }}
          className="albums-list"
          dataSource={albums}
          renderItem={(album) => {
            const strippedText = strip(album.description)
            const text = strippedText.length > 20 ? `${strippedText.slice(0, 50)}...` : strippedText
            return (
              <Col
                xs={32} sm={12}
                style={{ height: 250, marginBottom: 20, position: 'relative' }}
              >
                <Card
                  className="card-album"
                  hoverable
                  cover={(
                    <div
                      data-id={album.id}
                      style={{
                        height: 250,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundImage: `url("${album.cover}")`,
                      }}
                    />
                  )}
                >
                  <Dropdown
                    placement='topRight'
                    overlay={(
                      <Menu>
                        <Menu.Item key="0" onClick={() => onEdit(album)}>Sửa</Menu.Item>
                        <Menu.Item key="1" onClick={() => this.showDeleteConfirm(album.id)}>Xoá Album</Menu.Item>
                      </Menu>
                    )}
                    trigger={['click']}
                  >
                    <Icon
                      type="ellipsis"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 10,
                        padding: '10px',
                        zIndex: 1,
                        fontSize: 20,
                        color: '#fff',
                      }}
                    />
                  </Dropdown>
                  
                  <Link to={`/admin/albums/${album.id}`}>
                    <Meta title={album.name} description={text} />
                  </Link>
                </Card>
              </Col>
            )
          }}
        />
        {modalVisible && (
          <Modal
            title={!editingAlbum.id ? 'Thêm album' : 'Chỉnh sửa'}
            visible
            onCancel={onCancel}
            onOk={onSave}
            footer={[
              <Button key="back" onClick={onCancel}>Đóng</Button>,
              <Button
                key="submit"
                type="primary"
                loading={saving}
                onClick={onSave}
              >
                Lưu
              </Button>
            ]}
            width='auto'
          >
            <ModalAlbum ref={ref => {this.priAlbumStore.modalEdit = ref}} />
          </Modal>
        )}
      </div>
    );
  }
}

const WrappedApp = Form.create()(Album);

export default WrappedApp;