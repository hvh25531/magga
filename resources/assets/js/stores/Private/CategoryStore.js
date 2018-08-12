import { observable, action } from 'mobx'
import { message } from 'antd'
import axios from 'axios'

export default class CategoryStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @observable categories = []
  @observable totalCategories = null
  @observable currentPage = 1
  @observable pageSize = 10
  @observable loading = false
  @observable saving = false
  @observable adding = false
  @observable editingCat = null
  @observable newImage = ''
  @observable imageIsValid = false
  @observable loadingNewImage = false
  @observable previewImage = ''
  @observable previewVisible = false
  @observable deletingCatId = null
  @observable.ref imageInput = null

  @action fetch = (reload = true) => {
    if (reload) {
      this.loading = true
    }
    let url = `/api/categories?page=${this.currentPage}&limit=${this.pageSize}`

    axios.get(url)
    .then(res => {
      const { categories, total_categories: totalCategories } = res.data

      this.categories = categories
      this.totalCategories = totalCategories
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

  @action handleImageChange = (value) => {
    this.newImage = value
    this.imageIsValid = false
  }

  @action updateNewImage = (id, imageUrl) => {
    if (id !== 0) {
      this.categories.map(cat => {
        if (cat.id === id) {
          cat.previewImage = imageUrl
        }
      })
    } else {
      this.previewImage = imageUrl
    }
    this.newImage = ''
    this.imageIsValid = true
  }

  @action cancelNewImage = () => {
    this.newImage = ''
    this.imageInput.input.value = ''
    this.imageInput.focus()
  }

  @action handleImgPreview = (img) => {
    this.previewImage = ''
    setTimeout(() => {
      this.previewImage = img
    }, 50)
    
    if (img !== '') {
      this.previewVisible = true
    }
  }

  @action handleImgPreviewCancel = () => {
    this.previewVisible = false
  }

  @action onCreate = () => {
    this.adding = true
    this.modalVisible = true
    this.previewImage = ''
    this.editingCat = {
      id: 0
    }
  }

  @action onEdit = (cat) => {
    this.editingCat = cat
    this.adding = false
  }

  @action onCancel = () => {
    this.adding = false
    this.editingCat = null
  }

  @action onSave = (form) => {
    form.validateFields((err, values) => {
      if(err) {
        console.clear()
        return
      }
      if (values.image === this.editingCat.image) {
        values.image = null
      } else {
        if (!this.imageIsValid) {
          message.error('Bạn chưa xác thực hình ảnh!')
          return
        }
      }
      this.saving = true
      //console.log(values)
      
      axios.post('/api/admin/categories', values)
      .then((res) => {
        if (res.data.success) {
          message.success('Lưu thành công!')
          this.saving = false
          this.fetch(false)
          this.onCancel()
        } else {
          message.error('Lưu thất bại!')
          this.saving = false
        }
      })
      .catch(() => {
        message.error('Lưu thất bại!')
        this.saving = false
      })
    })
  }

  @action onDeleteConfirm = (id) => {
    this.deletingCatId = id
  }

  @action onDelete = () => {
    const id = this.deletingCatId
    return axios.delete(`/api/admin/categories/${id}`)
    .then(() => {
      message.success('Xoá thành công!')
      this.categories = this.categories.filter(cat => cat.id !== id)
      //this.fetch()
    })
    .catch(() => {
      message.error('Xoá thất bại!')
    })
  }

  @action onDeleteCancel = () => {
    this.deletingCatId = null
  }
}