import React from 'react'
import { render } from 'react-dom'
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'

//Store
import { Provider } from 'mobx-react'
import RootStore from './stores/RootStore'

// Public routes
import withWrapper from './components/HOC/Wrapper'
//import Home from './components/pages/Home'
import Authors from './components/pages/Authors'
import Author from './components/pages/Author'
import Albums from './components/pages/Albums'
import Album from './components/pages/Album'
import Posts from './components/pages/Posts'
import Post from './components/pages/Post'
import Home from './components/pages/Home'

// Admin routes
import Login from './components/admin/Login'
import withAdminWrapper from './components/HOC/AdminWrapper'
import AdminPost from './components/admin/Post'
import AdminAlbum from './components/admin/Album'
import AdminCategory from './components/admin/Category'
import AdminAuthor from './components/admin/Author'
import AdminTag from './components/admin/Tag'

render (
  <Provider store={RootStore}>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' name="Home" component={withWrapper(Home)} />
        <Route exact path='/posts' component={withWrapper(Posts)} />
        <Route exact path='/posts/:slug' component={withWrapper(Post)} />
        <Route exact path='/authors' component={withWrapper(Authors)} />
        <Route exact path='/authors/:slug' component={withWrapper(Author)} />
        <Route exact path='/albums' component={withWrapper(Albums)} />
        <Route exact path='/albums/:slug' component={withWrapper(Album)} />

        <Route exact path='/admin' component={() => <Redirect to="/admin/login"/>} />
        <Route exact path='/admin/login' component={Login} />
        <Route exact path='/admin/posts' component={withAdminWrapper(AdminPost)} />
        <Route exact path='/admin/albums' component={withAdminWrapper(AdminAlbum)} />
        <Route exact path='/admin/categories' component={withAdminWrapper(AdminCategory)} />
        <Route exact path='/admin/authors' component={withAdminWrapper(AdminAuthor)} />
        <Route exact path='/admin/tags' component={withAdminWrapper(AdminTag)} />
        <Route component={() => <Redirect to="/"/>} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);