import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Card, Col, List } from 'antd'
import styled from 'styled-components'
import { strip } from '../../utils'
import '../admin/styles.css'
const { Meta } = Card

const AuthorWrapper = styled.div`
  height: 250px;
  overflow: hidden;
  position: relative;
`

const AuthorBgImage = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  transition: all .3s ease-in-out;
  -webkit-transition: all .3s ease-in-out;

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.3);
    transition: all .3s ease-in-out;
    -webkit-transition: all .3s ease-in-out;
  }
  
  ${AuthorWrapper}:hover & {
    transform: scale(1.1);
    &:before {
      background-color: transparent;
    }
  }
`

const AuthorInfo = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  background-image: linear-gradient(transparent,rgba(0,0,0,.2));
  -webkit-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
  padding-top: 6rem;
  padding-bottom: 2rem;

  ${AuthorWrapper}:hover & {
    padding: .5rem;
    padding-top: 2rem;
    background-image: linear-gradient(transparent,rgba(0,0,0,.8));
  }
`

const AuthorName = styled.div`
  font-size: 1.333rem;
  padding-bottom: 1rem;
  font-weight: 600;
  transition: all .3s ease-in-out;

  ${AuthorWrapper}:hover & {
    padding-bottom: 5px;
  }
`

const AuthorTitle = styled.div`
  font-size: .875rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: .6;
`

@inject('store')
@observer
export default class Authors extends Component {
  componentDidMount() {
    this.props.store.authorStore.fetch()
  }
  
  render() {
    const {
      authors,
      loadingAuthors
    } = this.props.store.authorStore
    const { match } = this.props
    return (
      <div className="main-content">
        <Breadcrumb className="card">
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Tác giả</Breadcrumb.Item>
        </Breadcrumb>
        <List
          loading={loadingAuthors}
          dataSource={authors}
          renderItem={(author) => {
            return (
              <Col xs={24} sm={12} lg={8} xl={6}>
                <Link to={`${match.url}/${author.slug}`}>
                  <AuthorWrapper>
                    <AuthorBgImage
                      style={{ background: `url("${author.avatar}") center center / cover` }}
                    />

                    <AuthorInfo>
                      <AuthorName className="author-name">{author.name}</AuthorName>
                      <AuthorTitle>{author.title}</AuthorTitle>
                    </AuthorInfo>
                  </AuthorWrapper>
                </Link>
              </Col>
            )
          }}
        />
      </div>
    )
  }
}
