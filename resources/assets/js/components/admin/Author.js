import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Card, Col, Form, Icon, List, Modal, Popconfirm, Tooltip } from 'antd'
import { getBase64, strip } from '../../utils'
import ModalAuthor from './ModalAuthor'
import './styles.css'
const { Meta } = Card

@inject('store')
@observer
class Author extends Component {
  constructor(props) {
    super(props);
    this.priAuthorStore = this.props.store.priAuthorStore
  }

  componentDidMount() {
    this.priAuthorStore.fetch()
  }

  handleImgPreview = (id) => {
    let image = document.querySelector(`div[data-id="${id}"]`).style['background-image']
    image = image.replace(/url\("(.*?)"\)/i, '$1')
    this.priAuthorStore.handleImgPreview(image)
  }

  handleUpload = (file, id) => {
    getBase64(file, imageUrl => {
      document.querySelector(`img[data-id="${id}"]`).src = imageUrl
    });
  }

  onCreate = async () => {
    await this.priAuthorStore.onCreate()
    document.getElementsByTagName('input')[1].focus()
  }

  render() {
    const {
      authors,
      editingAuthor,
      loading,
      modalVisible,
      onEdit,
      onSave,
      onCancel,
      saving
    } = this.priAuthorStore;
    return (
      <div>
        <Button onClick={this.onCreate} type="primary" style={{ marginBottom: 16 }}>
          Thêm tác giả
        </Button>
        <List
          loading={loading}
          grid={{ gutter: 16 }}
          dataSource={authors}
          renderItem={(author, index) => {
            const strippedText = strip(author.about)
            const text = strippedText.length > 20 ? `${strippedText.slice(0, 50)}...` : strippedText
            return (
              <Col xs={32} sm={12} lg={8} xl={6} style={{ marginBottom: 15 }} >
                <Card
                  className="author-card"
                  hoverable
                  cover={(
                    <div
                      data-id={author.id}
                      style={{
                        height: 200,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundImage: `url("${author.avatar}")`,
                      }}
                    />
                  )}
                >
                  <Tooltip title="Chỉnh sửa">
                    <Icon
                      type="edit"
                      className="edit-icon"
                      onClick={() => onEdit(author)}
                    />
                  </Tooltip>
                  <Tooltip title="Xoá">
                    <Popconfirm
                      title="Bạn có chắc muốn xoá?"
                      onConfirm={() => onDelete(author.id)}
                      okText="Có"
                      cancelText="Huỷ"
                    >
                      <Icon type="delete" className="delete-icon" />
                    </Popconfirm>
                  </Tooltip>
                  <Meta
                    title={author.name}
                    description={text}
                  />
                </Card>
              </Col>
            )
          }}
        />
        {modalVisible && (
          <Modal
            title={!editingAuthor.id ? 'Thêm tác giả' : 'Chỉnh sửa'}
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
            <ModalAuthor ref={ref => {this.priAuthorStore.modalEdit = ref}} />
          </Modal>
        )}
      </div>
    );
  }
}

const WrappedApp = Form.create()(Author);

export default WrappedApp;