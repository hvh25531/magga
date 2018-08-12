import { observable, action } from 'mobx';
import axios from 'axios'

export default class AuthStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @observable token = null

  @action initState = (token, expires_in) => {
    const now = Math.round((new Date().getTime()) / 1000)
    if (expires_in > now) {
      this.token = token
      axios.defaults.headers.common['token'] = token
    }
  }
  
  @action loggedIn = (token, expires_in) => {
    this.token = token
    localStorage.setItem('token', token)
    localStorage.setItem('expires_in', expires_in)
    axios.defaults.headers.common['token'] = token
  }

  @action logOut = () => {
    this.token = null
    localStorage.removeItem('token')
    localStorage.removeItem('expires_in')
    axios.defaults.headers.common['token'] = null
  }
}