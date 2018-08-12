<?php

namespace App\Http\Controllers;


use App\Models\Author;
use App\Models\Album;
use App\Models\Post;
use App\Traits\SavePicture;
use Illuminate\Http\Request;

class AuthorController extends Controller {
  use SavePicture;
  function __construct() {
    $this->mod = new Author();
  }

  public function getAuthor() {
    return Author::select('id', 'name', 'title', 'slug', 'about', 'avatar')->get();
  }

  public function getAuthorDetail(Request $request) {
    $post_page             = $request->post_page;
    $album_page            = $request->album_page;
    $take                  = 10;
    $albums_skip           = ($album_page - 1) * $take;
    $posts_skip            = ($post_page - 1) * $take;
    return Author::with([
      'posts' => function($query) use ($posts_skip, $take) {
        $query->skip($posts_skip)->take($take);
    }, 
      'albums' => function($query) use ($albums_skip, $take) {
        $query->withCount('posts')->skip($albums_skip)->take($take);
      }
    ])->withCount('albums', 'posts')->where('slug', $request->slug)->first();
  }

  public function save(Request $request) {
    $id = $request->id;
    $request['slug'] = str_slug($request->name);
    $avatar = $request->avatar;
    if ($avatar) {
      if (strpos($avatar, 'data:image') !== FALSE) {
        $base_to_php = explode(',', $avatar);
        $avatar = base64_decode($base_to_php[1]);
      }
      
      $res = $this->savePicture($avatar);

      if ($res->success) {
        $img_link = $res->data->link;
        $request['avatar'] = $img_link;

        if ($id) {
          Author::where('id', $id)->update($request->all());
        } else {
          Author::create($request->all());
        }
        return ['success' => true];
      }
      return (array) $res;
    } else {
      Author::where('id', $id)->update($request->except('avatar'));
      return ['success' => true];
    }
  }

  public function destroy(Request $request) {
      $id = $request->id;
      Author::find($id)->delete();
      Album::where('author_id', $id)->update(['author_id', null]);
      Post::where('author_id', $id)->update(['author_id', null]);
  }

  public function store(Request $request, Author $author) {
    $this->savePicture($request, $author);
    $author->save();
  }

  public function update(Request $request, Author $author) {
    $this->savePicture($request, $author);
    $author->updateBy();
    $author->update($request->all());
  }

  public function softDelete(Request $request, Author $author) {
    App\Flight::withTrashed()->find($request->id)->destroy();
  }

  public function delete(Request $request) {
    Author::withTrashed()->find($request->id)->forceDelete();
  }

  public function authors() {
    return $this->mod->orderBy('id', 'DESC')->get();
  }

  public function author(Request $request,$id) {
    return Author::find($id);
  }
}
