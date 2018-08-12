import { observable, action } from 'mobx'
import axios from 'axios'
import { hasNoParamInUrl, hasPageParamInUrl } from '../../utils'
import { PAGE_PARAM_REGEX_1, PAGE_PARAM_REGEX_2 } from '../../consts'

export default class AlbumStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }
  
  @observable albums = []
  @observable featured = []
  @observable viewingAlbum = null
  @observable postsInViewingAlbum = []
  @observable relatedAlbums = []
  @observable categories = []
  @observable totalAlbums = null
  @observable currentPage = 1
  @observable loadingContent = false
  @observable loadingSidebar = false
  @observable search = null
  @observable url = null

  @action fetch = () => {
    this.loadingContent = true
    if (!this.search) {
      this.loadingSidebar = true
    }

    let url = '/api/albums' + this.search
    
    axios.get(url)
    .then(res => {
      const { albums, categories, total_albums, featured } = res.data
      this.albums = albums
      this.featured = featured
      this.categories = categories
      this.totalAlbums = total_albums
      this.loadingContent = false
      if (!this.search) {
        this.loadingSidebar = false
      }
    })
  }

  @action fetchViewingAlbum = (slug, history) => {
    this.viewingAlbum = null
    this.loadingContent = true
    axios.get(`/api/albums/${slug}`)
    .then(res => {
      if (!res.data) {
        history.push('/')
      }
      const { album, posts_in_album, related_albums } = res.data
      this.viewingAlbum = album
      this.postsInViewingAlbum = posts_in_album
      this.relatedAlbums = related_albums
      this.loadingContent = false
    })
  }

  @action pageChanged = (currentPage) => {
    const { url } = this
    this.currentPage = currentPage

    if (!hasPageParamInUrl(url)) {
      this.url = hasNoParamInUrl(url) ? url + `?page=${currentPage}` : url + `&page=${currentPage}`
    } else {
      this.url = currentPage === 1 ? (
        url.replace(PAGE_PARAM_REGEX_1, `$1`).replace(PAGE_PARAM_REGEX_2, `$1`)
      ) : (
        url.replace(PAGE_PARAM_REGEX_1, `$1$2${currentPage}`).replace(PAGE_PARAM_REGEX_2, `$1$2${currentPage}`)
      )
    }
  }

  @action updateUrl = async (url, search) => {
    this.url = url
    const pageParamMatched = hasPageParamInUrl(url)
    if (pageParamMatched) {
      this.currentPage = Number(pageParamMatched[2])
    }
    this.search = await search
    this.fetch()
  }

  @action onSearch = (keyword) => {
    this.loadingContent = true
    axios.get(`/api/albums?q=${keyword}`)
      .then(res => {
        const { albums, categories, total_albums, featured } = res.data
        this.albums = albums
        this.featured = featured
        this.categories = categories
        this.totalAlbums = total_albums
        this.loadingContent = false
      })
  }
}