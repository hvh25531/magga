import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Card, Form, Icon, Input, Modal, message, Spin, Tooltip, Upload } from 'antd';
import styled from 'styled-components'
import _ from 'lodash'
import { checkImageLink, getBase64, validateImageFile } from '../../utils'
import './styles.css'
const confirm = Modal.confirm
const FormItem = Form.Item
const { Meta } = Card;

const StyledCard = styled(Card)`
  margin: 0 1% 20px 1% !important;
  width: 23%;
  @media (max-width: 1199px) {
    width: 31%;
  }

  @media (max-width: 991px) {
    width: 48%;
  }

  @media (max-width: 576px) {
    width: 100%;
  }
`

const DivWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

@inject('store')
@observer
class Category extends Component {
  constructor(props) {
    super(props);
    this.priCategoryStore = this.props.store.priCategoryStore
  }

  componentDidMount() {
    this.priCategoryStore.fetch()
  }

  onEdit = async (cat) => {
    const { editingCat } = this.priCategoryStore
    if (editingCat) {
      document.querySelector(`div[data-id="${editingCat.id}"]`).style['background-image'] = `url("${editingCat.image}`
    }
    
    await this.priCategoryStore.onEdit(cat)
    this.props.form.setFieldsValue({
      name: cat.name,
      image: cat.image
    })
  }

  onCreate = async () => {
    await this.priCategoryStore.onCreate()
    this.props.form.setFieldsValue({
      name: '',
      image: undefined
    })
  }

  onCancel = (id) => {
    const { categories } = this.priCategoryStore
    this.priCategoryStore.onCancel()
    if (id !== 0) {
      const cat = categories.filter(cat => cat.id === id)[0]
      document.querySelector(`div[data-id="${id}"]`).style['background-image'] = `url("${cat.image}")`
    } else {
      document.querySelector(`div[data-id="0"]`).style['background-image'] = ''
    }
  }

  onSave = () => {
    const { form } = this.props
    this.priCategoryStore.onSave(form)
  }

  handleNameChange = (name) => {
    this.props.form.setFieldsValue({ name })
  }

  handleImageChange = (e) => {
    const value = e.target.value
    const { editingCat } = this.priCategoryStore
    document.querySelector(`div[data-id="${editingCat.id}"]`).style['background-image'] = `url("${editingCat.image}")`

    const newCard = document.querySelector(`div[data-id="0"]`)
    const newCardZoomIcon = document.querySelector('div[data-id="0"] .zoom-icon')
    if (newCard) {
      newCard.style['background-image'] = ''
    }
    if (newCardZoomIcon) {
      newCardZoomIcon.style.display = 'none'
    }
    this.priCategoryStore.handleImageChange(value)
  }

  handleImgPreview = async (id) => {
    let image = document.querySelector(`div[data-id="${id}"]`).style['background-image']
    image = image.replace(/url\("(.*?)"\)/i, '$1')
    await this.priCategoryStore.handleImgPreview(image)
    
    const newCard = document.querySelector('div[data-id="0"]')
    const newCardZoomIcon = document.querySelector('div[data-id="0"] .zoom-icon')
    if (newCard && !newCard.style['background-image'] && newCardZoomIcon) {
      newCardZoomIcon.style.display = 'none'
    }
  }

  confirmNewImage = async (id) => {
    const { newImage } = this.priCategoryStore
    this.priCategoryStore.loadingNewImage = true
    const ok = await checkImageLink(newImage)
    this.priCategoryStore.loadingNewImage = false
    if (ok) {
      document.querySelector(`div[data-id="${id}"]`).style['background-image'] = `url("${newImage}")`
      this.props.form.setFieldsValue({ image: newImage })
      this.priCategoryStore.updateNewImage(id, newImage)
      const newCardZoomIcon = document.querySelector('div[data-id="0"] .zoom-icon')
      if (newCardZoomIcon) {
        newCardZoomIcon.style.display = 'block'
      }
    } else {
      this.props.form.setFieldsValue({ image: null })
      this.priCategoryStore.cancelNewImage()
      message.error('Không xác định được hình ảnh!')
    }
  }

  handleUpload = (file, id) => {
    validateImageFile(file, (ok) => {
      if (ok) {
        getBase64(file, imageUrl => {
          this.priCategoryStore.updateNewImage(id, imageUrl)
          document.querySelector(`div[data-id="${id}"]`).style['background-image'] = `url("${imageUrl}")`
          const newCardZoomIcon = document.querySelector('div[data-id="0"] .zoom-icon')
          if (newCardZoomIcon) {
            newCardZoomIcon.style.display = 'block'
          }
          this.props.form.setFieldsValue({ image: imageUrl })
        });
      }
    })
  }

  showDeleteConfirm = (id) => {
    const { onDeleteConfirm, onDelete, onDeleteCancel } = this.priCategoryStore
    onDeleteConfirm(id)

    confirm({
      title: 'Xoá danh mục?',
      content: (
        <p>
          Việc xoá danh mục này sẽ <b>cập nhật lại danh mục</b> của các <b>album, bài viết</b> thuộc danh mục này thành <b>"Không xác định"</b>.<br /><br />
          Bạn có chắc muốn xoá danh mục này?
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
      categories,
      editingCat,
      loading,
      adding,
      saving,
      newImage,
      loadingNewImage,
      handleImgPreviewCancel,
      previewImage,
      previewVisible,
      onDeleteConfirm
    } = this.priCategoryStore
    const { getFieldDecorator } = this.props.form
    const renderUploader = (id) => (
      <div>
        <Input
          ref={input => this.priCategoryStore.imageInput = input}
          placeholder="Nhập link hình ảnh"
          onChange={this.handleImageChange}
          onPressEnter={() => this.confirmNewImage(id)}
          suffix={
            newImage ? (
              !loadingNewImage ? (
                <Icon
                  type="check"
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.confirmNewImage(id)}
                />
              ) : (
                <Spin size="small" />
              )
            ) : null
          }
        />

        <span style={{
          display: 'block',
          width: 100,
          margin: '0 auto',
          fontWeight: 'bold',
          textAlign: 'center',
          background: 'linear-gradient(transparent, rgba(0, 0, 0, .4))',
          color: '#fff'
        }}>Hoặc</span>

        <Upload
          listType="picture-card"
          showUploadList={false}
          customRequest={({ file }) => this.handleUpload(file, id)}
        >
          <div>
            {editingCat && editingCat.id ? <Icon type="edit" /> : <Icon type="plus" />}
            <div className="ant-upload-text">Upload</div>
          </div>
        </Upload>
      </div>
    );
    const renderCategories = categories.map(cat => {
      const editing = !_.isEmpty(editingCat) && cat.id === editingCat.id
      return (
        <StyledCard
          className={`category-flex-item${editing ? ' editing' : ''}`}
          key={cat.id}
          //style={{ width: 240, height: 292 }}
          hoverable
          cover={
            <div
              data-id={cat.id}
              className="img-upload"
              style={{ backgroundImage: `url(${cat.image})` }}
            >
              {/* <img alt={cat.name} src={cat.image} data-id={cat.id} /> */}
              <Tooltip title="Xem ảnh đầy đủ">
                <Icon
                  type="arrows-alt"
                  className="zoom-icon"
                  onClick={() => this.handleImgPreview(cat.id)}
                />
              </Tooltip>

              {editing &&
                <FormItem>
                  {getFieldDecorator('id', {
                    initialValue: cat.id,
                  })(
                    <input hidden />
                  )}
                </FormItem>
              }
              
              {editing &&
                <FormItem>
                  {getFieldDecorator('image', {
                    initialValue: null,
                  })(
                    <div className="clearfix post-img">

                      {editingCat && renderUploader(cat.id)}          
                    </div>
                  )}
                </FormItem>
              }
            </div>
          }
          actions={[
            <div>
              {(!editingCat || (editingCat && cat.id !== editingCat.id)) &&
                <Tooltip title="Sửa">
                  <Icon type="edit" onClick={() => this.onEdit(cat)} />
                </Tooltip>
              }
              
              {editing &&
                <div>
                  {!saving ? (
                    <Tooltip title="Lưu">
                      <Icon type="check" onClick={this.onSave} />
                    </Tooltip>
                  ) : (
                    <Spin size="small" />
                  )}
                  
                  <Tooltip title="Huỷ">
                    <Icon type="close" onClick={() => this.onCancel(cat.id)} />
                  </Tooltip>
                </div>
              }
            </div>
            ,
            <Tooltip title="Xoá">
              <Icon type="delete" onClick={() => this.showDeleteConfirm(cat.id)} />
            </Tooltip>
          ]}
        >
          {((editingCat && cat.id !== editingCat.id) || !editingCat) && 
            <Meta title={cat.name} />
          }
          {editing &&
            <FormItem>
              {getFieldDecorator('name', {
                initialValue: cat.name,
                rules: [{ required: true, message: 'Vui lòng nhập tên danh mục!' }],
              })(
                <input
                  autoFocus
                  type="text"
                  className="ant-input"
                  placeholder="Tên danh mục"
                  onChange={this.handleInputChange}
                />
              )}
            </FormItem>
          }
        </StyledCard>
      )
    })

    const addMoreBtn = (
      !adding ? (
        <StyledCard
          className="category-flex-item add-more-btn"
          key="addMore"
        >
          <div className="ant-upload ant-upload-select ant-upload-select-picture-card">
            <span className="ant-upload" onClick={this.onCreate}>
              <div>
                <i className="anticon anticon-plus"></i>
                <div className="ant-upload-text">Thêm</div>
              </div>
            </span>
          </div>
        </StyledCard>
      ) : (
        <StyledCard
          className="category-flex-item adding"
          hoverable
          cover={
            <div
              data-id={0}
              className="img-upload"
            >
              {!_.isEmpty(previewImage) && (
                <Tooltip title="Xem ảnh đầy đủ">
                  <Icon
                    type="arrows-alt"
                    className="zoom-icon"
                    onClick={() => this.handleImgPreview(0)}
                  />
                </Tooltip>
              )}
              <FormItem>
                {getFieldDecorator('image', {
                  rules: [{ required: true, message: 'Vui lòng chọn hình ảnh!' }],
                })(
                  renderUploader(0)
                )}
              </FormItem>
            </div>
          }
          actions={[
            !saving ? (
              <Tooltip title="Lưu">
                <Icon type="check" onClick={this.onSave} />
              </Tooltip>
            ) : (
              <Spin size="small" />
            ),
            <Tooltip title="Huỷ">
              <Icon type="close" onClick={() => this.onCancel(0)} />
            </Tooltip>
          ]}
        >
          <FormItem>
            {getFieldDecorator('name', {
              initialValue: '',
              rules: [{ required: true, message: 'Vui lòng nhập tên danh mục!' }],
            })(
              <Input
                autoFocus
                type="text"
                className="ant-input"
                placeholder="Tên danh mục"
                onChange={this.handleNameChange}
              />
            )}
          </FormItem>
        </StyledCard>
      )
    );

    return loading ? (
      <Spin size="large" />
    ) : (
      <Form>
        <DivWrapper id="categories">
          {addMoreBtn}
          {renderCategories}
          <Modal
            visible={previewVisible && !_.isEmpty(previewImage)}
            footer={null}
            onCancel={handleImgPreviewCancel}
          >
            <img style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </DivWrapper>
      </Form>
    )
  }
}

const WrappedApp = Form.create()(Category);

export default WrappedApp;