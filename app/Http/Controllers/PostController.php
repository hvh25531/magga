<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Album;
use App\Models\Author;
use App\Models\Category;
use App\Traits\SavePicture;
use Illuminate\Http\Request;

class PostController extends Controller {
  use SavePicture;

  /* public $mod;

  function __construct() {
    $this->mod = new Post();
  } */

  public function getPost(Request $request) {
    $page             = $request->page;
    $take             = 10;
    $skip             = ($page - 1) * $take;
    $posts_query      = Post::with('category:id,name,slug', 'author:id,name,slug')
                        ->orderBy('id', 'desc');
    $total_posts      = Post::count();
    
    $cat_search       = $request->category;
    if ($cat_search) {
      $cat_id         = Category::where('slug', $cat_search)->first()->id;
      $posts_query    = $posts_query->where('category_id', $cat_id);
      $total_posts    = $posts_query->get()->count();
    }

    $author_search = $request->author;
    if ($author_search) {
      $author_id      = Author::where('slug', $author_search)->first()->id;
      $posts_query    = $posts_query->where('author_id', $author_id);
      $total_posts    = $posts_query->get()->count();
    }

    $tag_search = $request->tag;
    if ($tag_search) {
      $posts_query    = $posts_query->where('tags', 'like', "%\"$tag_search\"%");
      $total_posts    = $posts_query->get()->count();
    }

    if ($request->q) {
      $posts_query = $posts_query
                      ->where('title', 'like', "%{$request->q}%")
                      ->orWhere('content', 'like', "%{$request->q}%");
      $total_posts = $posts_query->get()->count();
    }
    
    $posts            = $posts_query->skip($skip)->take($take)->get();
    $featured         = Post::where('is_featured', 1)->orderBy('id', 'desc')->take(10)->get();
    $categories       = Category::select('name', 'slug')->withCount('posts')->get();
    return compact('posts', 'featured', 'categories', 'total_posts');
  }

  public function getPostDetail(Request $request) {
    $post = Post::with('category:id,name,slug', 'author:id,name,slug')
                ->where('slug', $request->slug)->first();
    if(!$post) {
      return 0;
    }
    
    $related_posts = Post::select('id', 'title', 'slug')
                     ->where('album_id', $post->album_id)
                     ->orWhere('category_id', $post->category_id)
                     ->orWhere('author_id', $post->author_id)
                     ->get();
    $post->views ++;
    $post->save();
    return compact('post', 'related_posts');
  }

  public function getPostAdmin(Request $request) {
    $onlyTrashed      = $request->onlyTrashed;
    $page             = $request->page;
    $take             = $request->limit;
    $skip             = ($page - 1) * $take;
    $posts_query      = Post::with('category:id,name', 'author:id,name', 'album:id,name')
                        ->orderBy('id', 'desc')
                        ->skip($skip)
                        ->take($take);
    if ($onlyTrashed) {
      $posts_query = $posts_query->onlyTrashed();
    }

    $posts = $posts_query ->get();

    $total_posts = $onlyTrashed ? Post::onlyTrashed()->count() : Post::count();
    $albums     = Album::select('id', 'name', 'category_id', 'author_id')->get();
    $authors    = Author::select('id', 'name')->get();
    $categories = Category::select('id', 'name')->get();
    
    return compact('albums', 'authors', 'categories', 'posts', 'total_posts');
  }
  
  public function save(Request $request) {
    // "data:image/png;base64,BBBFBfj42Pj4"
    $id = $request->id;
    $request['slug'] = str_slug($request->title);
    $request['user_id'] = UserController::getUserInfo($request)->id;
    if ($id) {
      $request['tags'] = json_encode($request->tags);
    }

    $cover_img = $request->cover_img;
    if ($cover_img) {
      if (strpos($cover_img, 'data:image') !== FALSE) {
        $base_to_php = explode(',', $cover_img);
        $cover_img = base64_decode($base_to_php[1]);
      }
      
      $res = $this->savePicture($cover_img);

      if ($res->success) {
        $img_link = $res->data->link;
        $request['cover_img'] = $img_link;

        if ($id) {
          Post::where('id', $id)->update($request->all());
        } else {
          Post::create($request->all());
        }
        return ['success' => true];
      }
      return (array) $res;
    } else {
      if ($id) {
        Post::where('id', $id)->update($request->except('cover_img'));
      } else {
        Post::create($request->except('cover_img'));
      }
      return ['success' => true];
    }
  }

  public function destroy($id) {
    $post = Post::withTrashed()->find($id);
    if ($post->deleted_at) {
      $post->forceDelete();
    } else {
      $post->delete();
    }
  }

  public function restore($id) {
    $post = Post::onlyTrashed()->find($id);
    $post->restore();
  }

  public function update(Request $request, Post $post) {
    $this->savePicture($request, $post);
    $post->updateBy();
    $post->update($request->all());
  }
  
  public function posts() {
    return $this->mod->orderBy('id', 'DESC')->get();
  }
  
  public function post(Request $request,$id) {
    return Post::find($id);
  }
}
