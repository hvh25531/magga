import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Button, Checkbox, Form, message, Select, Input, Tag, Tooltip, Icon, Upload, Modal, Spin } from 'antd'
import { getBase64, checkImageLink, validateImageFile } from '../../utils'
import Editor from './Editor'
const FormItem = Form.Item
const Option = Select.Option

@inject('store')
@observer
class ModalPost extends Component {
  constructor(props) {
    super(props)

    this.priPostStore = this.props.store.priPostStore
    this.priModalPostStore = this.props.store.priModalPostStore
  }

  handleRemoveTag = (removedTag) => {
    this.priModalPostStore.removeTag(removedTag)
    this.props.form.setFieldsValue({ tags: this.priModalPostStore.tags })
  }

  handleTagConfirm = () => {
    this.priModalPostStore.confirmTag()
    this.props.form.setFieldsValue({ tags: this.priModalPostStore.tags })
  }

  handleContentChange = (content) => {
    this.props.form.setFieldsValue({ content })
  }

  handleUpload = (file) => {
    validateImageFile(file, (ok) => {
      if (ok) {
        getBase64(file, imageUrl => {
          this.priModalPostStore.updateNewImage(imageUrl)
          this.props.form.setFieldsValue({ cover_img: imageUrl })
        })
      } else {
        this.props.form.setFieldsValue({ cover_img: null })
      }
    })

    this.priModalPostStore.imageInput.input.value = ''
  }

  confirmNewImage = async () => {
    this.priModalPostStore.loadingNewImage = true
    const ok = await checkImageLink(this.priModalPostStore.newImage)
    this.priModalPostStore.loadingNewImage = false
    if (ok) {
      this.priModalPostStore.updateNewImage()
    } else {
      this.props.form.setFieldsValue({ cover_img: null })
      this.priModalPostStore.cancelNewImage()
      message.error('Không xác định được hình ảnh!')
    }
  }

  onCancelEditImage = () => {
    this.priModalPostStore.onCancelEditImage()
    this.props.form.setFieldsValue({ cover_img: null })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { editingPost, albums, authors, categories, currentTab } = this.priPostStore
    const {
      inputVisible,
      newImage,
      previewImage,
      loadingNewImage,
      tags,
      newTag,
      handleImageChange,
      onImageEdit,
      editingImage,
      handleTagChange,
      showInput,
    } = this.priModalPostStore
    const { album, author, category, content, cover_img: coverImg, id, source, title, is_featured: isFeatured } = editingPost
    return (
      <Form>
        {getFieldDecorator('id', {
          initialValue: id,
        })(
          <Input hidden />
        )}

        <FormItem
          label="Tiêu đề bài viết"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('title', {
            initialValue: title,
            rules: [{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }],
          })(
            <Input
              placeholder="Nhập tiêu đề bài viết ở đây"
              disabled={currentTab !== 1}
            />
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
              placeholder={author ? author.name : 'Chọn tác giả bài viết'}
              disabled={currentTab !== 1}
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
              placeholder={category ? category.name : 'Chọn danh mục bài viết'}
              disabled={currentTab !== 1}
            >
              <Option value={null}>Không rõ</Option>
              {categories.map(cat => (
                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem
          label="Album"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('album_id', {
            initialValue: album ? album.id : null
          })(
            <Select
              placeholder={album ? album.id : 'Chọn album bài viết (nếu có)'}
              disabled={currentTab !== 1}
            >
              <Option value={null}>Không nằm trong Album</Option>
              {albums.map(ab => {
                const authorId = getFieldValue('author_id')
                const categoryId = getFieldValue('category_id')
                return ab.author_id === authorId && ab.category_id === categoryId && (
                  <Option key={ab.id} value={ab.id}>{ab.name}</Option>
                )
              })}
            </Select>
          )}
        </FormItem>

        <FormItem
          label="Nguồn"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('source', {
            initialValue: source || null
          })(
            <Input
              placeholder={source || 'Nguồn link bài viết (nếu có)'}
              disabled={currentTab !== 1}
            />
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

        {getFieldDecorator('tags', {
          initialValue: tags
        })(
          <Input hidden />
        )}

        <FormItem
          label="Tags"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          <div>
            {tags.map((tag) => {
              const isLongTag = tag.length > 20
              const tagElem = (
                <Tag
                  key={tag}
                  closable={currentTab === 1}
                  afterClose={() => this.handleRemoveTag(tag)}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </Tag>
              )
              return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem
            })}

            {inputVisible ? (
              <Input
                ref={input => this.priModalPostStore.tagInput = input}
                type="text"
                size="small"
                style={{ width: 78 }}
                value={newTag}
                onChange={handleTagChange}
                onBlur={this.handleTagConfirm}
                onPressEnter={this.handleTagConfirm}
              />
            ) : (
              currentTab === 1 && (
                <Tag
                  onClick={showInput}
                  style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                  <Icon type="plus" /> New Tag
                </Tag>
              )
            )}
          </div>
        </FormItem>

        <FormItem
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}
          label='Ảnh bài viết'
        >
          <code>(Hỗ trợ các định dạng: JPG, JPEG, PNG, GIF)</code>
          {getFieldDecorator('cover_img', {
            initialValue: null,
          })(
            <div className="clearfix post-img">
              {(coverImg !== null || previewImage !== null) && (
                <img src={previewImage !== null ? previewImage : coverImg} />
              )}
              {previewImage && !editingImage && currentTab === 1 && (
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
                    ref={input => this.priModalPostStore.imageInput = input}
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
          label="Nội dung:"
        >
          {getFieldDecorator('content', {
            initialValue: content,
            rules: [
              { pattern: /^(?!.*<p><br><\/p>$).*$/, message: 'Vui lòng nhập nội dung bài viết!' },
              { required: true, message: 'Vui lòng nhập nội dung bài viết!'}
            ],
          })(
            <Editor
              disabled={currentTab !== 1}
              id={id}
              text={content}
              placeholder='Nội dung bài viết...'
              handleContentChange={this.handleContentChange}
            />
          )}
        </FormItem>
      </Form>
    )
  }
}

const FormModal = Form.create()(ModalPost)

export default FormModal