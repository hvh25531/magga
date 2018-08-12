import { observable, action, computed } from 'mobx';
import { message } from 'antd';
import axios from 'axios';
import { strip } from '../../utils'

export default class PostStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @observable tabs = [
    { key : 1, name: 'Bài viết'},
    { key : 2, name: 'Đã xoá'},
  ]
  @observable currentTab = this.tabs[0].key
  @observable posts = []
  @observable albums = []
  @observable authors = []
  @observable categories = []
  @observable totalPosts = null
  @observable currentPage = 1
  @observable pageSize = 10
  @observable modalVisible = false
  @observable loading = false
  @observable saving = false
  @observable editingPost = null
  @observable.ref modalEdit = null

  @action fetch = (reload = true) => {
    if (reload) {
      this.loading = true
    }
    let url = `/api/admin/posts?page=${this.currentPage}&limit=${this.pageSize}`
    if (this.currentTab === 2) {
      url = url.concat('&onlyTrashed=1')
    }

    axios.get(url)
    .then(res => {
      const { posts, total_posts: totalPosts, albums, authors, categories } = res.data
      posts.map(post => {
        post.key = post.id
        post.author_name = post.author ? post.author.name : null
        post.category_name = post.category ? post.category.name: null
      })

      this.albums = albums
      this.authors = authors
      this.categories = categories
      this.posts = posts
      this.totalPosts = totalPosts
      if (reload) {
        this.loading = false
      }
    })
  }

  @action pageChanged = (currentPage) => {
    this.currentPage = currentPage
    this.fetch()
  }

  @action pageSizeChanged = (currentPage, pageSize) => {
    this.currentPage = currentPage
    this.pageSize = pageSize
    this.fetch()
  }

  @action onTabChange = (key) => {
    this.currentPage = 1
    this.currentTab = key
    this.fetch()
  }

  @action onCancel = () => {
    this.modalVisible = false
    this.rootStore.priModalPostStore.editingImage = false
    this.rootStore.priModalPostStore.newImage = ''
  }

  @action onCreate = () => {
    this.editingPost = {
      id: null,
      album: null,
      cover_img: null,
      content: '',
      tags: []
    }
    this.rootStore.priModalPostStore.previewImage = null
    this.modalVisible = true
  }

  @action onEdit = (record) => {
    this.editingPost = record
    this.rootStore.priModalPostStore.previewImage = record.cover_img
    this.rootStore.priModalPostStore.tags = record.tags
    this.modalVisible = true
  }

  @action onSave = () => {
    this.modalEdit.validateFields((err, values) => {
      if(err) {
        return
      }
      values.excerpt = strip(values.content, 500)
      
      if (!values.cover_img || values.cover_img === this.editingPost.cover_img) {
        values.cover_img = null
      } else {
        if (!this.rootStore.priModalPostStore.imageIsValid) {
          message.error('Bạn chưa xác thực hình ảnh!')
          return
        }
      }
      this.saving = true
      
      axios.post('/api/admin/posts', values)
      .then((res) => {
        if (res.data.success) {
          message.success('Lưu thành công!')
          this.saving = false
          this.fetch(false)
          if (!values.id) {
            this.modalVisible = false
          }
        } else {
          message.error('Lưu thất bại!')
          this.saving = false
        }
      })
      .catch(() => {
        message.error('Lưu thất bại!')
        this.saving = false
      });
    })
  }

  @action onDelete = (id) => {
    axios.delete(`/api/admin/posts/${id}`)
    .then(() => {
      message.success('Xoá thành công!')
      this.posts = this.posts.filter(post => post.id !== id)
      //this.fetch()
    })
    .catch(() => {
      message.error('Xoá thất bại!')
    });
  }

  @action onRestore = () => {
    this.saving = true
    axios.patch(`/api/admin/posts/${this.editingPost.id}`)
    .then(() => {
      message.success('Phục hồi thành công!')
      this.posts = this.posts.filter(post => post.id !== this.editingPost.id)
      this.saving = false
      this.modalVisible = false
      //this.fetch()
    })
    .catch(() => {
      this.saving = false
      message.error('Phục hồi thất bại!')
    });
  }

  @computed
  get postCount() {
    return this.posts.length;
  }
}

/* const singleton = new PostStore();

export default singleton; */