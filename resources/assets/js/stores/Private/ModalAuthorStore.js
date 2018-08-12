import { observable, action } from 'mobx';

export default class ModalAuthorStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @observable inputVisible = false
  @observable editingImage = false
  @observable previewImage = null
  @observable newImage = ''
  @observable imageIsValid = false
  @observable loadingNewImage = false
  @observable.ref imageInput = null

  @action handleImageChange = (e) => {
    this.newImage = e.target.value
    this.imageIsValid = false
  }

  @action onImageEdit = () => {
    this.editingImage = true
  }

  @action onCancelEditImage = () => {
    const { editingAuthor } = this.rootStore.priAuthorStore
    this.editingImage = false
    this.newImage = ''
    this.previewImage = editingAuthor.id ? editingAuthor.avatar : null
    if(this.imageInput){
      this.imageInput.input.value = ''
    }
  }

  @action updateNewImage = (imageUrl) => {
    if (imageUrl) {
      this.previewImage = imageUrl
    } else {
      this.previewImage = this.newImage
    }
    this.editingImage = false
    this.newImage = ''
    this.imageIsValid = true
  }

  @action cancelNewImage = () => {
    this.newImage = ''
    this.imageInput.input.value = ''
    this.imageInput.focus()
  }
}