import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './styles.css'

export default class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.text,
      placeholder: this.props.placeholder
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.setState({
        text: nextProps.text,
        placeholder: nextProps.placeholder
      })
    }
  }

  handleChange = (value) => {
    this.setState({ text: value })
    this.props.handleContentChange(value)
  }

  render() {
    const { text, placeholder } = this.state
    const { disabled } = this.props
    return (
      <ReactQuill
        className={disabled ? 'disabled' : null}
        value={text}
        placeholder={placeholder}
        onChange={this.handleChange}
        modules={Editor.modules}
        formats={Editor.formats} 
      />
    )
  }
}

function imageHandler() {
  var range = this.quill.getSelection()
  var value = prompt('Nhập link hình ảnh')
  this.quill.insertEmbed(range.index, 'image', value)
}

Editor.modules = {
  toolbar: {
    container: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
      {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
    handlers: {
      image: imageHandler
    }
  },
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}
/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]

/* 
 * PropType validation
 */
Editor.propTypes = {
  text: PropTypes.string,
  placeholder: PropTypes.string,
}