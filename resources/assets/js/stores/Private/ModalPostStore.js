import { observable, action } from 'mobx';

export default class ModalPostStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @observable inputVisible = false
  @observable tags = []
  @observable newTag = ''
  @observable imgModalVisible = false
  @observable editingImage = false
  @observable previewImage = null
  @observable newImage = ''
  @observable imageIsValid = false
  @observable loadingNewImage = false
  @observable.ref tagInput = null
  @observable.ref imageInput = null

  @action showInput = async () => {
    this.inputVisible = await true
    this.tagInput.focus()
  }
  
  @action handleTagChange = (e) => {
    this.newTag = e.target.value
  }

  @action removeTag = (removedTag) => {
    const newTags = this.tags.filter(tag => tag !== removedTag)
    this.tags = newTags
  }
  
  @action confirmTag = () => {
    if (this.newTag) {
      const newTags = this.tags.filter(tag => tag !== this.newTag).concat(this.newTag)
      this.tags = newTags
      this.newTag = ''
    }
    this.inputVisible = false
  }

  @action handleImageChange = (e) => {
    this.newImage = e.target.value
    this.imageIsValid = false
  }

  @action onImageEdit = () => {
    this.editingImage = true
  }

  @action onCancelEditImage = () => {
    this.editingImage = false
    this.newImage = ''
    this.previewImage = this.rootStore.priPostStore.editingPost.cover_img
    if(this.imageInput){
      this.imageInput.input.value = ''
    }
  }

  @action updateNewImage = (imageUrl = null) => {
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
  
  @action handleImgPreview = () => {
    this.imgModalVisible = true
  }

  @action handleImgPreviewCancel = () => {
    this.imgModalVisible = false
  }
}