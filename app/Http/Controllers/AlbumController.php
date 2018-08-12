<?php

namespace App\Http\Controllers;


use App\Models\Album;
use App\Models\Post;
use App\Models\Author;
use App\Models\Category;
use App\Traits\SavePicture;
use Illuminate\Http\Request;

class AlbumController extends Controller {
    use SavePicture;

    function __construct() {
        $this->mod = new Album();
    }

    public function getAlbum(Request $request) {
        $page             = $request->page;
        $take             = 10;
        $skip             = ($page - 1) * $take;
        $albums_query     = Album::with('category:id,name,slug', 'author:id,name,slug')
                            ->withCount('posts')
                            ->orderBy('id', 'desc');
        $total_albums     = Album::count();

        $cat_search       = $request->category;
        if ($cat_search) {
            $cat_id         = Category::where('slug', $cat_search)->first()->id;
            $albums_query   = $albums_query->where('category_id', $cat_id);
            $total_albums   = $albums_query->get()->count();
        }

        $author_search    = $request->author;
        if ($author_search) {
            $author_id      = Author::where('slug', $author_search)->first()->id;
            $albums_query   = $albums_query->where('author_id', $author_id);
            $total_albums   = $albums_query->get()->count();
        }
        
        if ($request->q) {
            $albums_query = $albums_query
                            ->where('name', 'like', "%{$request->q}%")
                            ->orWhere('description', 'like', "%{$request->q}%");
            $total_albums = $albums_query->get()->count();
        }

        $albums           = $albums_query->skip($skip)->take($take)->get();

        $featured         = Album::where('is_featured', 1)
                            ->withCount('posts')
                            ->orderBy('id', 'desc')
                            ->take(6)
                            ->get();
        $categories       = Category::select('name', 'slug')->withCount('albums')->get();
        return compact('albums', 'featured', 'categories', 'total_albums');
    }

    public function getAlbumAdmin(Request $request) {
        //$page             = $request->page;
        //$take             = $request->limit;
        //$skip             = ($page - 1) * $take;
        $albums_query     = Album::with('category:id,name', 'author:id,name')
                            ->orderBy('id', 'desc');
                            //->skip($skip)
                            //->take($take);

        $albums = $albums_query->get();
    
        $total_albums = Album::count();
        $authors    = Author::select('id', 'name')->get();
        $categories = Category::select('id', 'name')->get();
        
        return compact('albums', 'authors', 'categories', 'total_albums');
    }

    public function getAlbumDetail($slug) {
        $album = Album::with('category:id,name,slug', 'author:id,name,slug')
                        ->where('slug', $slug)->first();
        if(!$album) {
            return 0;
        }
        $related_albums = Album::select('id', 'name', 'slug', 'cover')
                         ->withCount('posts')
                         ->where('author_id', $album->author_id)
                         ->orWhere('category_id', $album->category_id)
                         ->take(6)
                         ->get();
        $album->views ++;
        $album->save();

        $posts_in_album = Post::where('album_id', $album->id)->orderBy('id', 'desc')->get();
        return compact('album', 'posts_in_album', 'related_albums');
    }

    public function save(Request $request) {
        $id = $request->id;
        $request['slug'] = str_slug($request->name);
        $request['user_id'] = UserController::getUserInfo($request)->id;
        $cover = $request->cover;
        if ($cover) {
        if (strpos($cover, 'data:image') !== FALSE) {
            $base_to_php = explode(',', $cover);
            $cover = base64_decode($base_to_php[1]);
        }
        
        $res = $this->savePicture($cover);

        if ($res->success) {
            $img_link = $res->data->link;
            $request['cover'] = $img_link;

            if ($id) {
            Album::where('id', $id)->update($request->all());
            } else {
            Album::create($request->all());
            }
            return ['success' => true];
        }
        return (array) $res;
        } else {
        Album::where('id', $id)->update($request->except('cover'));
        return ['success' => true];
        }
    }

    public function destroy($id) {
        Album::find($id)->delete();
        Post::where('album_id', $id)->forceDelete();
    }

    public function store(Request $request, Album $album) {
        $this->savePicture($request, $album);
        $album->save();
    }

    public function update(Request $request, Album $album) {
        $this->savePicture($request, $album);
        $album->updateBy();
        $album->update($request->all());
    }
}
