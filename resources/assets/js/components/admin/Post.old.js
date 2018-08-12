import React, { Component } from 'react'
import axios from 'axios';
import _ from 'lodash'
import { Table, Popconfirm, Button, Modal, message } from 'antd';
import ModalPost from './ModalPost'
import './styles.css'

export default class Post extends Component {
  constructor(props) {
    super(props);

    this.columns = [{
      title: 'Tiêu đề bài viết',
      dataIndex: 'title',
      width: 200
    }, {
      title: 'Danh mục',
      dataIndex: 'category_name',
      width: 100
    }, {
      title: 'Tác giả',
      dataIndex: 'author_name',
      width: 150
    }, {
      title: 'Ngày đăng',
      dataIndex: 'published_at'
    }, {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            style={{ marginBottom: 5 }}
            onClick={() => this.onEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Chắc chưa?"
            okText="Rồi" cancelText="Huỷ"
            onConfirm={() => this.onDelete(record.id)}
          >
            <Button type="danger">Xoá</Button>
          </Popconfirm>
        </div>
      ),
    }];

    this.state = {
      totalPosts: null,
      currentPage: 1,
      pageSize: 10,
      posts: [],
      albums: [],
      authors: [],
      categories: [],
      selectedRowKeys: [],
      modalVisible: false,
      loading: false,
      saving: false,
      editingPost: null
    }
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const { currentPage, pageSize} = this.state
    this.setState({ loading: true })
    axios.get(`/api/posts?page=${currentPage}&limit=${pageSize}`).then(res => {
      const { posts, total_posts: totalPosts, albums, authors, categories } = res.data
      posts.map(post => {
        post.key = post.id
        post.author_name = post.author ? post.author.name : null
        post.category_name = post.category ? post.category.name: null
      })
      this.setState({
        albums,
        authors,
        categories,
        posts,
        totalPosts,
        currentPage,
        loading: false
      })
    })
  }

  pageChanged = (currentPage) => {
    this.setState({ currentPage }, () => {
      this.fetch()
    })
  }

  pageSizeChanged = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize }, () => {
      this.fetch()
    })
  }

  handleCancel = () => {
    this.setState({ modalVisible: false })
  }

  onEdit = (record) => {
    this.setState({
      modalVisible: true,
      editingPost: record
    })
  }

  onCreate = () => {
    this.setState({
      modalVisible: true,
      editingPost: {}
    })
  }

  onSave = () => {
    this.modalEdit.validateFields((err, values) => {
      console.log(values)
      /* if(err) return;
      this.setState({ saving: true })
      values.tags = JSON.stringify(values.tags)
      axios.post('/api/posts', values)
      .then((res) => {
        if (res.data.success) {
          message.success('Lưu thành công!')
          this.setState({ saving: false }, () => this.fetch())
        } else {
          message.error('Lưu thất bại!')
          this.setState({ saving: false })
        }
      })
      .catch((error) => {
        message.error('Lưu thất bại!')
        this.setState({ saving: false })
      }); */
    })
  }

  onDelete = (id) => {
    const { posts } = this.state;
    this.setState({ data: posts.filter(post => post.id !== id) });
  }

  deleteTag = (e) => {
    console.log(e)
  }

  render() {
    const { albums, authors, categories, currentPage, editingPost, loading, modalVisible, pageSize, posts, saving, totalPosts } = this.state;
    const columns = this.columns;
    return (
      <div>
        <Button onClick={this.onCreate} type="primary" style={{ marginBottom: 16 }}>
          Thêm bài viết
        </Button>
        
        <Table
          loading={loading}
          columns={columns}
          dataSource={posts}
          scroll={{ x: 1000, y: 425 }}
          size="small"
          pagination={{
            position: 'both',
            current: currentPage,
            total: totalPosts,
            pageSize: pageSize,
            showSizeChanger: true,
            onChange: this.pageChanged,
            onShowSizeChange: this.pageSizeChanged,
            style: {
              marginTop: 10,
              marginBottom: 10,
              textAlign: 'right'
            }
          }}
        />
        
        {modalVisible && (
          <Modal
            title={_.isEmpty(editingPost) ? 'Thêm bài viết' : 'Sửa bài viết'}
            visible
            onCancel={this.handleCancel}
            onOk={this.onSave}
            footer={[
              <Button key="back" onClick={this.handleCancel}>Huỷ</Button>,
              <Button key="submit" type="primary" loading={saving} onClick={this.onSave}>
                Lưu
              </Button>,
            ]}
            width='60%'
          >
            <ModalPost
              ref={instance => {this.modalEdit = instance}}
              post={editingPost}
              albums={albums}
              authors={authors}
              categories={categories}
            />
          </Modal>
        )}
      </div>
    )
  }
}
