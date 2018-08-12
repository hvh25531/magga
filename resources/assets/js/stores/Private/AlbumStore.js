import { observable, action } from 'mobx';
import { message } from 'antd';
import axios from 'axios';

export default class AlbumStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @observable albums = []
  @observable authors = []
  @observable categories = []
  @observable adding = false
  @observable editingAlbum = null
  @observable loading = true
  @observable saving = false
  @observable modalVisible = false
  @observable deletingAlbumId = null
  @observable.ref modalEdit = null

  @action fetch = (reload = true) => {
    if (reload) {
      this.loading = true
    }

    axios.get('/api/admin/albums')
    .then(res => {
      const { albums, authors, categories } = res.data
      this.albums = albums
      this.authors = authors
      this.categories = categories
      if (reload) {
        this.loading = false
      }
    })
  }

  @action onCreate = () => {
    this.editingAlbum = {
      id: null,
      name: '',
      cover: '',
      description: '',
    }
    this.modalVisible = true,
    this.rootStore.priModalAlbumStore.previewImage = null
  }

  @action onEdit = (album) => {
    this.editingAlbum = album
    this.rootStore.priModalAlbumStore.previewImage = album.cover
    this.modalVisible = true
  }

  @action onCancel = () => {
    this.modalVisible = false
    this.rootStore.priModalAlbumStore.editingImage = false
  }

  @action onSave = () => {
    this.modalEdit.validateFields((err, values) => {
      console.log(values)
      if(err) {
        return
      }
      if (!values.cover || values.cover === this.editingAlbum.cover) {
        values.cover = null
      } else {
        if (!this.rootStore.priModalAlbumStore.imageIsValid) {
          message.error('Bạn chưa xác thực hình ảnh!')
          return
        }
      }
      this.saving = true
      
      axios.post('/api/admin/albums', values)
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

  @action onDeleteConfirm = (id) => {
    this.deletingAlbumId = id
  }

  @action onDelete = () => {
    const id = this.deletingAlbumId
    return axios.delete(`/api/admin/albums/${id}`)
    .then(() => {
      message.success('Xoá thành công!')
      this.albums = this.albums.filter(cat => cat.id !== id)
      //this.fetch()
    })
    .catch(() => {
      message.error('Xoá thất bại!')
    })
  }

  @action onDeleteCancel = () => {
    this.deletingAlbumId = null
  }
}