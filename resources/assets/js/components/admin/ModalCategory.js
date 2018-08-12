import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Form, Select, Input, Button, Tag, Tooltip, Icon, Upload, Modal } from 'antd';
import Editor from './Editor'
const FormItem = Form.Item;
const Option = Select.Option;

class ModalCategory extends Component {
  state = {
    inputVisible: false,
    newTag: '',
    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  };

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleTagChange = (e) => {
    this.setState({ newTag: e.target.value });
  }

  handleAuthorChange = (author) => {
    this.props.form.setFieldsValue({ author })
  }
  handleCategoryChange = (category) => {
    this.props.form.setFieldsValue({ category })
  }
  handleAlbumChange = (album) => {
    this.props.form.setFieldsValue({ album })
  }
  handleSourceChange = (source) => {
    this.props.form.setFieldsValue({ source })
  }
  handleContentChange = (content) => {
    this.props.form.setFieldsValue({ content })
  }

  handleTagConfirm = () => {
    const state = this.state;
    const newTag = state.newTag;
    let tags = state.tags;
    if (newTag && tags.indexOf(newTag) === -1) {
      tags = [...tags, newTag];
    }
    console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      newTag: '',
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  handleImgPreviewCancel = () => this.setState({ previewVisible: false })

  handleImgPreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleImgChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { author = '', category = '', title = '', album = '', source = '', content = '' } = this.props.data;
    const { tags, inputVisible, newTag } = this.state;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Form onSubmit={this.handleSubmit}>
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
              onChange={this.handle}
            />
          )}
        </FormItem>
        
        <FormItem
          label="Tác giả"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('author', {
            initialValue: author || undefined
          })(
            <Select
              showSearch
              placeholder={author || 'Chọn tác giả bài viết'}
              onChange={this.handleAuthorChange}
            >
              <Option value="Không rõ">Không rõ</Option>
              <Option value="Liên Hương">Liên Hương</Option>
              <Option value="Osho">Osho</Option>
              <Option value="Toại Khanh">Toại Khanh</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          label="Danh mục"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('category', {
            initialValue: category || undefined
          })(
            <Select
              showSearch
              placeholder={category || 'Chọn danh mục bài viết'}
              onChange={this.handleCategoryChange}
            >
              <Option value="Sức khoẻ">Sức khoẻ</Option>
              <Option value="Giáo dục">Giáo dục</Option>
              <Option value="Tâm Linh">Tâm Linh</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          label="Album"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('album', {
            initialValue: album || undefined
          })(
            <Select
              showSearch
              placeholder={album || 'Chọn album bài viết (nếu có)'}
              onChange={this.handleAlbumChange}
            >
              <Option value="none">Không nằm trong Album</Option>
              <Option value="Album 1">Album 1</Option>
              <Option value="Album 2">Album 2</Option>
              <Option value="Album 3">Album 3</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          label="Nguồn"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('source', {
            initialValue: source || undefined
          })(
            <Input
              placeholder={source || 'Nguồn link bài viết (nếu có)'}
              onChange={this.handleSourceChange} 
            />
          )}
        </FormItem>

        <FormItem
          label="Tags"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('tags', {
            initialValue: tags
          })(
            <div>
              {tags.map((tag, index) => {
                const isLongTag = tag.length > 20;
                const tagElem = (
                  <Tag key={tag} closable afterClose={() => this.handleClose(tag)}>
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </Tag>
                );
                return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
              })}

              {inputVisible && (
                <Input
                  ref={input => this.input = input}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={newTag}
                  onChange={this.handleTagChange}
                  onBlur={this.handleTagConfirm}
                  onPressEnter={this.handleTagConfirm}
                />
              )}

              {!inputVisible && (
                <Tag
                  onClick={this.showInput}
                  style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                  <Icon type="plus" /> New Tag
                </Tag>
              )}
            </div>
          )}
        </FormItem>

        <FormItem
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}
          label='Ảnh bài viết'
        >
          {getFieldDecorator('upload', {
            getValueFromEvent: this.normFile,
          })(
            <div className="clearfix">
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handleImgPreview}
                onChange={this.handleImgChange}
              >
                {fileList.length >= 3 ? null : uploadButton}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleImgPreviewCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </div>
          )}
        </FormItem>

        <FormItem
          wrapperCol={{ span: 18, offset: 3 }}
        >
          {getFieldDecorator('content', {
            rules: [{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }],
          })(
            <div>
              <p>Nội dung:</p>
              <Editor
                text={content}
                placeholder='Nội dung bài viết...'
                handleContentChange={this.handleContentChange}
              />
            </div>
          )}
        </FormItem>

        {/* <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </FormItem> */}
      </Form>
    );
  }
}

ModalCategory.propTypes = {
  data: PropTypes.object,
}

const WrappedApp = Form.create()(ModalCategory);

export default WrappedApp;