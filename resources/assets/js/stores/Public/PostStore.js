import { observable, action } from 'mobx';
import axios from 'axios';
import _ from 'lodash'
import { hasNoParamInUrl, hasPageParamInUrl } from '../../utils'
import { PAGE_PARAM_REGEX_1, PAGE_PARAM_REGEX_2 } from '../../consts'

export default class PostStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }
  
  @observable posts = []
  @observable featured = []
  @observable viewingPost = null
  @observable relatedPosts = []
  @observable categories = []
  @observable totalPosts = null
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

    let url = '/api/posts' + this.search
    
    axios.get(url)
    .then(res => {
      const { posts, categories, total_posts, featured } = res.data
      this.posts = posts
      this.featured = featured
      this.categories = categories
      this.totalPosts = total_posts
      this.loadingContent = false
      if (!this.search) {
        this.loadingSidebar = false
      }
    })
  }

  @action fetchViewingPost = (slug, history) => {
    this.viewingPost = null
    axios.get(`/api/posts/${slug}`)
    .then(res => {
      if (!res.data) {
        history.push('/')
      }
      const { post, related_posts } = res.data
      this.viewingPost = post
      this.relatedPosts = related_posts
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
    axios.get(`/api/posts?q=${keyword}`)
      .then(res => {
        const { posts, categories, total_posts, featured } = res.data
        this.posts = posts
        this.featured = featured
        this.categories = categories
        this.totalPosts = total_posts
        this.loadingContent = false
      })
  }
}
