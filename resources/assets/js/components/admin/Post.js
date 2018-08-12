import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Table, Popconfirm, Button, Modal } from 'antd'
import Tabs from '../common/Tabs'
import ModalPost from './ModalPost'
import './styles.css'

@inject('store')
@observer
export default class Post extends Component {
  constructor(props) {
    super(props);

    this.priPostStore = this.props.store.priPostStore

    this.columns = [{
      title: 'Tiêu đề bài viết',
      dataIndex: 'title',
      width: 200,
      sorter: (a, b) => a.title.localeCompare(b.title),
    }, {
      title: 'Danh mục',
      dataIndex: 'category_name',
      width: 120,
      sorter: (a, b) => a.category_name.localeCompare(b.category_name),
    }, {
      title: 'Tác giả',
      dataIndex: 'author_name',
      width: 150,
      sorter: (a, b) => a.author_name.localeCompare(b.author_name),
    }, {
      title: 'Ngày đăng',
      dataIndex: 'created_at',
      sorter: (a, b) => (new Date(a.created_at)).getTime() - (new Date(b.created_at)).getTime(),
    }, {
      title: 'Action',
      key: 'operation',
      width: 100,
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            style={{ marginBottom: 5 }}
            onClick={() => this.priPostStore.onEdit(record)}
          >
            {this.priPostStore.currentTab === 1 ? 'Sửa' : 'Xem'}
          </Button>
          <Popconfirm
            title={
              this.priPostStore.currentTab === 1 ?
              'Chắc chưa?'
              : 
              'Bạn có chắc muốn xoá vĩnh viễn?'
            }
            okText="Chắc" cancelText="Huỷ"
            onConfirm={() => this.priPostStore.onDelete(record.id)}
          >
            <Button type="danger">Xoá</Button>
          </Popconfirm>
        </div>
      )
    }];
  }

  componentDidMount() {
    this.priPostStore.fetch()
  }

  render() {
    const {
      currentPage,
      editingPost,
      loading,
      modalVisible,
      pageSize,
      posts,
      saving,
      totalPosts,
      onCreate,
      pageChanged,
      pageSizeChanged,
      onCancel,
      onSave,
      onRestore,
      tabs,
      currentTab,
      onTabChange
    } = this.priPostStore;
    const columns = this.columns
    return (
      <div>
        
        <Tabs tabs={tabs} currentTab={currentTab} onTabChange={onTabChange} />

        {currentTab === 1 && !loading && (
          <Button onClick={onCreate} type="primary" style={{ marginBottom: 10 }}>
            Thêm bài viết
          </Button>
        ) }
        
        <Table
          loading={loading}
          columns={columns}
          dataSource={posts}
          scroll={{ x: 800, y: 425 }}
          size="small"
          pagination={{
            position: 'both',
            current: currentPage,
            total: totalPosts,
            pageSize: pageSize,
            showSizeChanger: true,
            onChange: pageChanged,
            onShowSizeChange: pageSizeChanged,
            style: {
              marginTop: 10,
              marginBottom: 10,
              textAlign: 'right'
            }
          }}
        />
        
        {modalVisible && (
          <Modal
            title={!editingPost.id ? 'Thêm bài viết' : 'Sửa bài viết'}
            visible
            onCancel={onCancel}
            onOk={onSave}
            footer={[
              <Button key="back" onClick={onCancel}>Đóng</Button>,
              currentTab === 1 ? (
                <Button
                  key="submit"
                  type="primary"
                  loading={saving}
                  onClick={onSave}
                >
                  Lưu
                </Button>
              ) : (
                <Button
                  key="restore"
                  type="primary"
                  loading={saving}
                  onClick={onRestore}
                >
                  Phục hồi
                </Button>
              ),
            ]}
            width='auto'
          >
            <ModalPost ref={ref => {this.priPostStore.modalEdit = ref}} />
          </Modal>
        )}
      </div>
    )
  }
}
