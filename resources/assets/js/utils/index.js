import axios from 'axios'
import { message } from 'antd'

export const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export const checkBgLoaded = (el, callback) => {
  let bg = ''
  if (el.currentStyle) { // IE
      bg = el.currentStyle.backgroundImage
  } else if (document.defaultView && document.defaultView.getComputedStyle) { // Firefox
      bg = document.defaultView.getComputedStyle(el, '').backgroundImage
  } else { // try and get inline style
      bg = el.style.backgroundImage
  }

  bg = bg.replace(/url\("(.*?)"\)/i, '$1')

  const image = document.createElement('img')
  image.src = bg
  image.onload = function () {
    callback()
  }
}

export const checkImgLoaded = (el, callback) => {
  let src = el.src

  const image = document.createElement('img')
  image.src = src
  image.onload = function () {
    callback()
  }
}

export const checkImageLink = (imageUrl) => {
  return axios.head(`https://cors-anywhere.herokuapp.com/${imageUrl}`)
    .then((res) => {
      return res.headers['content-type'].indexOf('image') !== -1
    })
    .catch(() => {
      return false
    })
}

export const validateImageFile = (file, callback) => {
  const accepted = ['image/jpeg', 'image/png', 'image/gif']

  const isValidFormat = accepted.indexOf(file.type) !== -1
  if (!isValidFormat) {
    message.error('Định dạng không được hỗ trợ!')
  }
  
  const isValidSize = file.size / 1024 / 1024 < 5
  if (!isValidSize) {
    message.error('File phải có dung lượng nhỏ hơn 5MB!')
  }

  callback(isValidFormat && isValidSize)
}

export const strip = (html, length = null) => {
  let tmp = document.createElement('DIV')
  tmp.innerHTML = html

  let text = tmp.textContent || tmp.innerText || ''
  return length ? text.slice(0, length) : text
}

export const checkToken = (callback) => {
  const token = localStorage.getItem('token')
  const expires_in = localStorage.getItem('expires_in')
  if (token) {
    callback(token, expires_in)
  }
}

export const hasPageParamInUrl = (url) => {
  return url.match(/(.+page=)(.+)/)
}

export const hasCategoryParamInUrl = (url) => {
  if (!hasPageParamInUrl(url)) {
    return url.match(/(.+category=)(.+)/)
  }
  return url.match(/(.+category=)(.+)(&.+)/)
}

export const hasNoParamInUrl = (url) => {
  return url.indexOf('?') === -1
}