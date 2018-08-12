<?php

namespace App\Http\Controllers;


use App\Models\Album;
use App\Models\Author;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;

class PageController extends Controller {
    public function home(Request $request) {
        $albums = Album::orderBy('id', 'DESC')->take(10)->get();
        $authors = Author::orderBy('id', 'DESC')->take(10)->get();
        $categories = Category::orderBy('id', 'DESC')->take(10)->get();
        $posts = Post::orderBy('id', 'DESC')->take(10)->get();
        return [
            'albums' => $albums,
            'authors' => $authors,
            'categories' => $categories,
            'pots' => $posts
        ];
    }
}
