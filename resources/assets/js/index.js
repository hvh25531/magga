import React from 'react'
import { render } from 'react-dom'
import {
  Router,
  Route,
  Switch
} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import HomeComponent from './components/HomeComponent'
import AuthorComponent from './components/AuthorComponent'
import CategoryComponent from './components/CategoryComponent'
import AlbumComponent from './components/AlbumComponent'

const history = createBrowserHistory()
render (
  <Router history={history}>
    <Switch>
      <Route path='/' component={HomeComponent} />
      <Route path='/users/create' component={CreateUser} />
      <Route path='/users/edit/:id' component={EditUser} />      
      <Route path='/authors' component={AuthorComponent} />
      <Route path='/categories' component={CategoryComponent} />
      <Route path='/albums' component={AlbumComponent} />
    </Switch>
  </Router>, document.getElementById('app'))