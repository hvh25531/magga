import { observable, action } from 'mobx'
import axios from 'axios'

export default class AuthorStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }
  
  @observable authors = []
  @observable authorDetails = null
  @observable totalAuthors = null
  @observable currentPage = 1
  @observable currentPostPage = 1
  @observable currentAlbumPage = 1
  @observable loadingAuthors = false
  @observable loadingAuthorDetails = false

  @action fetch = () => {
    this.currentPostPage = 1
    this.currentAlbumPage = 1
    this.loadingAuthors = true
    axios.get('/api/authors')
    .then(res => {
      this.authors = res.data
      this.loadingAuthors = false
    })
  }

  @action fetchAuthorDetails = (slug) => {
    if(!slug) {
      slug = this.authorDetails.slug
    } else {
      this.loadingAuthorDetails = true
      this.authorDetails = null
    }

    let url = `/api/authors/${slug}`
    if (this.currentPostPage !== 1) {
      url = url + `?post_page=${this.currentPostPage}`
    }

    if (this.currentAlbumPage !== 1) {
      url = this.currentPostPage !== 1 ? url + `&album_page=${this.currentAlbumPage}` : url + `?album_page=${this.currentAlbumPage}`
    }

    axios.get(url)
    .then(res => {
      this.authorDetails = res.data
      if (slug) {
        this.loadingAuthorDetails = false
      }
    })
  }

  @action pageChanged = (currentPage) => {
    this.currentPage = currentPage
    this.fetch()
  }

  @action pagePostInAuthorChanged = (currentPage) => {
    this.currentPostPage = currentPage
    this.fetchAuthorDetails()
  }

  @action pageAlbumInAuthorChanged = (currentPage) => {
    this.currentAlbumPage = currentPage
    this.fetchAuthorDetails()
  }
}