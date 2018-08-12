import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Button, Checkbox, Form, message, Select, Input, Tag, Tooltip, Icon, Upload, Modal, Spin } from 'antd'
import { getBase64, checkImageLink, validateImageFile } from '../../utils'
import Editor from './Editor'
const { TextArea } = Input
const FormItem = Form.Item
const Option = Select.Option

@inject('store')
@observer
class ModalAlbum extends Component {
  constructor(props) {
    super(props)

    this.priAlbumStore = this.props.store.priAlbumStore
    this.priModalAlbumStore = this.props.store.priModalAlbumStore
  }

  handleContentChange = (description) => {
    this.props.form.setFieldsValue({ description })
  }

  handleUpload = (file) => {
    validateImageFile(file, (ok) => {
      if (ok) {
        getBase64(file, imageUrl => {
          this.priModalAlbumStore.updateNewImage(imageUrl)
          this.props.form.setFieldsValue({ cover: imageUrl })
        })
      } else {
        this.props.form.setFieldsValue({ cover: null })
      }
    })

    this.priModalAlbumStore.imageInput.input.value = ''
  }

  confirmNewImage = async () => {
    this.priModalAlbumStore.loadingNewImage = true
    const ok = await checkImageLink(this.priModalAlbumStore.newImage)
    this.priModalAlbumStore.loadingNewImage = false
    if (ok) {
      this.priModalAlbumStore.updateNewImage()
    } else {
      this.props.form.setFieldsValue({ cover: null })
      this.priModalAlbumStore.cancelNewImage()
      message.error('Không xác định được hình ảnh!')
    }
  }

  onCancelEditImage = () => {
    this.priModalAlbumStore.onCancelEditImage()
    this.props.form.setFieldsValue({ cover: null })
  }

  render() {
    
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { editingAlbum, authors, categories } = this.priAlbumStore
    const {
      newImage,
      loadingNewImage,
      onImageEdit,
      editingImage,
      previewImage,
      handleImageChange,
    } = this.priModalAlbumStore
    const { description, id, name, author, category, is_featured: isFeatured } = editingAlbum
    return (
      <Form>
        {getFieldDecorator('id', {
          initialValue: id,
        })(
          <Input hidden />
        )}

        <FormItem
          label="Tên album"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('name', {
            initialValue: name,
            rules: [{ required: true, message: 'Vui lòng nhập tên album!' }],
          })(
            <Input placeholder="Nhập tên album ở đây" />
          )}
        </FormItem>

        <FormItem
          label="Tác giả"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('author_id', {
            initialValue: author ? author.id : null
          })(
            <Select
              showSearch
              placeholder={author ? author.name : 'Chọn tác giả bài viết'}
            >
              <Option value={null}>Không rõ</Option>
              {authors.map(aut => (
                <Option key={aut.id} value={aut.id}>{aut.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem
          label="Danh mục"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('category_id', {
            initialValue: category ? category.id : null,
          })(
            <Select
              showSearch
              placeholder={category ? category.name : 'Chọn danh mục bài viết'}
            >
              <Option value={null}>Không rõ</Option>
              {categories.map(cat => (
                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem
          label="Nổi bật?"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('is_featured', {
            initialValue: isFeatured || 0
          })(
            <Checkbox />
          )}
        </FormItem>

        <FormItem
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}
          label='Ảnh album'
        >
          <code>(Hỗ trợ các định dạng: JPG, JPEG, PNG, GIF)</code>
          {getFieldDecorator('cover', {
            initialValue: null,
            rules: [{ required: !id, message: 'Vui lòng chọn hình ảnh!' }],
          })(
            <div className="clearfix post-img">
              {previewImage !== null && (
                <img src={previewImage} />
              )}
              {previewImage && !editingImage && (
                <Tooltip title="Chỉnh sửa">
                  <Icon
                    type="edit"
                    className="edit-icon"
                    onClick={onImageEdit}
                  />
                </Tooltip>
              )}

              {(editingImage || !previewImage) && (
                <div>
                  <Input
                    ref={input => this.priModalAlbumStore.imageInput = input}
                    placeholder="Nhập link hình ảnh"
                    onChange={handleImageChange}
                    onPressEnter={this.confirmNewImage}
                    suffix={
                      newImage ? (
                        !loadingNewImage ? (
                          <Icon
                            type="check"
                            style={{ cursor: 'pointer' }}
                            onClick={this.confirmNewImage}
                          />
                        ) : (
                          <Spin size="small" />
                        )
                      ) : null
                    }
                  />

                  <span>Hoặc</span>

                  <Upload
                    listType="picture-card"
                    showUploadList={false}
                    customRequest={({ file }) => this.handleUpload(file)}
                  >
                    <div>
                      {id ? <Icon type="edit" /> : <Icon type="plus" />}
                      <div className="ant-upload-text">Upload</div>
                    </div>
                  </Upload>
                </div>
              )}

              {(newImage || editingImage) && (
                <Button type="primary" onClick={this.onCancelEditImage}>Huỷ</Button>
              )}
            </div>
          )}
        </FormItem>

        <FormItem
          wrapperCol={{
            sm: { span: 18, offset: 3 },
            xs: { span: 18, offset: 0 }
          }}
          labelCol={{
            md: { span: 3, offset: 3 },
            sm: { span: 4, offset: 3 },
            xs: { span: 3, offset: 0 }
          }}
          label="Giới thiệu:"
        >
          {getFieldDecorator('description', {
            initialValue: description,
            rules: [
              { pattern: /^(?!.*<p><br><\/p>$).*$/, message: 'Trường này không được để trống!' },
              { required: true, message: 'Trường này không được để trống!'}
            ],
          })(
            <TextArea placeholder='Giới thiệu về album...' />
          )}
        </FormItem>
      </Form>
    )
  }
}

const FormModal = Form.create()(ModalAlbum)

export default FormModal