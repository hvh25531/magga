import { observable, action } from 'mobx';
import { message } from 'antd';
import axios from 'axios';

export default class AuthorStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @observable authors = []
  @observable adding = false
  @observable editingAuthor = null
  @observable loading = true
  @observable saving = false
  @observable modalVisible = false
  @observable.ref modalEdit = null

  @action fetch = (reload = true) => {
    if (reload) {
      this.loading = true
    }

    axios.get('/api/authors')
    .then(res => {
      this.authors = res.data
      if (reload) {
        this.loading = false
      }
    })
  }

  @action onCreate = () => {
    this.modalVisible = true,
    this.editingAuthor = {
      id: null,
      name: '',
      avatar: '',
      about: '',
    }
    this.rootStore.priModalAuthorStore.previewImage = null
  }

  @action onEdit = (author) => {
    this.editingAuthor = author
    this.rootStore.priModalAuthorStore.previewImage = author.avatar
    this.modalVisible = true
  }

  @action onCancel = () => {
    this.modalVisible = false
    this.rootStore.priModalAuthorStore.editingImage = false
  }

  @action onSave = () => {
    this.modalEdit.validateFields((err, values) => {
      if(err) {
        return
      }
      if (!values.avatar || values.avatar === this.editingAuthor.avatar) {
        values.avatar = null
      } else {
        if (!this.rootStore.priModalAuthorStore.imageIsValid) {
          message.error('Bạn chưa xác thực hình ảnh!')
          return
        }
      }
      this.saving = true
      
      axios.post('/api/admin/authors', values)
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
    return axios.delete(`/api/admin/authors/${id}`)
    .then(() => {
      message.success('Xoá thành công!')
      this.authors = this.authors.filter(author => author.id !== id)
      //this.fetch()
    })
    .catch(() => {
      message.error('Xoá thất bại!')
    })
  }
}