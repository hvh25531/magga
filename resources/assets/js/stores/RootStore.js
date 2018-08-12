import PostStore from './Public/PostStore'
import AlbumStore from './Public/AlbumStore'
import AuthorStore from './Public/AuthorStore'

import AuthStore from './Private/AuthStore'
import PriPostStore from './Private/PostStore'
import PriAlbumStore from './Private/AlbumStore'
import PriAuthorStore from './Private/AuthorStore'
import PriCategoryStore from './Private/CategoryStore'
import PriModalPostStore from './Private/ModalPostStore'
import PriModalAlbumStore from './Private/ModalAlbumStore'
import PriModalAuthorStore from './Private/ModalAuthorStore'

class RootStore {
  constructor() {
    this.postStore = new PostStore(this)
    this.albumStore = new AlbumStore(this)
    this.authorStore = new AuthorStore(this)

    this.authStore = new AuthStore(this)
    this.priPostStore = new PriPostStore(this)
    this.priAlbumStore = new PriAlbumStore(this)
    this.priAuthorStore = new PriAuthorStore(this)
    this.priCategoryStore = new PriCategoryStore(this)
    this.priModalPostStore = new PriModalPostStore(this)
    this.priModalAlbumStore = new PriModalAlbumStore(this)
    this.priModalAuthorStore = new PriModalAuthorStore(this)
  }
}

const singleton = new RootStore();

export default singleton;