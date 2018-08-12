import React, { Component } from 'react'
import Card from '../common/Card'
import { IconLink } from '../common/Icons'

export default class Category extends Component {
  render() {
    return (
      <div className="row">
        <div className="h-masonry same-size">
          <Card classes={['masonry-brick']} icon={IconLink} />
          <Card classes={['masonry-brick']} icon={IconLink} />
          <Card classes={['masonry-brick']} icon={IconLink} />
          <Card classes={['masonry-brick']} icon={IconLink} />
          <Card classes={['masonry-brick']} icon={IconLink} />
        </div>
      </div>
    )
  }
}
