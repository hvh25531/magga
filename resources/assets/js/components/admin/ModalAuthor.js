import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Button, Form, message, Select, Input, Tag, Tooltip, Icon, Upload, Modal, Spin } from 'antd'
import { getBase64, checkImageLink, validateImageFile } from '../../utils'
import Editor from './Editor'
const FormItem = Form.Item
const Option = Select.Option

@inject('store')
@observer
class ModalAuthor extends Component {
  constructor(props) {
    super(props)

    this.priAuthorStore = this.props.store.priAuthorStore
    this.priModalAuthorStore = this.props.store.priModalAuthorStore
  }

  handleContentChange = (about) => {
    this.props.form.setFieldsValue({ about })
  }

  handleUpload = (file) => {
    validateImageFile(file, (ok) => {
      if (ok) {
        getBase64(file, imageUrl => {
          this.priModalAuthorStore.updateNewImage(imageUrl)
          this.props.form.setFieldsValue({ avatar: imageUrl })
        })
      } else {
        this.props.form.setFieldsValue({ avatar: null })
      }
    })

    this.priModalAuthorStore.imageInput.input.value = ''
  }

  confirmNewImage = async () => {
    this.priModalAuthorStore.loadingNewImage = true
    const ok = await checkImageLink(this.priModalAuthorStore.newImage)
    this.priModalAuthorStore.loadingNewImage = false
    if (ok) {
      this.priModalAuthorStore.updateNewImage()
    } else {
      this.props.form.setFieldsValue({ avatar: null })
      this.priModalAuthorStore.cancelNewImage()
      message.error('Không xác định được hình ảnh!')
    }
  }

  onCancelEditImage = () => {
    this.priModalAuthorStore.onCancelEditImage()
    this.props.form.setFieldsValue({ avatar: null })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { editingAuthor } = this.priAuthorStore
    const {
      newImage,
      loadingNewImage,
      onImageEdit,
      editingImage,
      previewImage,
      handleImageChange,
    } = this.priModalAuthorStore
    const { about, id, name, title } = editingAuthor
    return (
      <Form>
        {getFieldDecorator('id', {
          initialValue: id,
        })(
          <Input hidden />
        )}

        <FormItem
          label="Tên tác giả"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('name', {
            initialValue: name,
            rules: [{ required: true, message: 'Vui lòng nhập tên tác giả!' }],
          })(
            <Input placeholder="Nhập tên tác giả ở đây" />
          )}
        </FormItem>

        <FormItem
          label="Là một ..."
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('title', {
            initialValue: title,
            //rules: [{ required: true, message: 'Vui lòng nhập tên tác giả!' }],
          })(
            <Input placeholder="Ví dụ: Người khai trí, Nhà huyền môn, Thiền sư,..." />
          )}
        </FormItem>

        <FormItem
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}
          label='Ảnh tác giả'
        >
          <code>(Hỗ trợ các định dạng: JPG, JPEG, PNG, GIF)</code>
          {getFieldDecorator('avatar', {
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
                    ref={input => this.priModalAuthorStore.imageInput = input}
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
          {getFieldDecorator('about', {
            initialValue: about,
            rules: [
              { pattern: /^(?!.*<p><br><\/p>$).*$/, message: 'Trường này không được để trống!' },
              { required: true, message: 'Trường này không được để trống!'}
            ],
          })(
            <Editor
              id={id}
              text={about}
              placeholder='Giới thiệu về tác giả...'
              handleContentChange={this.handleContentChange}
            />
          )}
        </FormItem>
      </Form>
    )
  }
}

const FormModal = Form.create()(ModalAuthor)

export default FormModal