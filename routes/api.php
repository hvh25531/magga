<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('posts', 'PostController@getPost');
Route::get('posts/{slug}', 'PostController@getPostDetail');
Route::get('albums', 'AlbumController@getAlbum');
Route::get('albums/{slug}', 'AlbumController@getAlbumDetail');
Route::get('authors', 'AuthorController@getAuthor');
Route::get('authors/{slug}', 'AuthorController@getAuthorDetail');
Route::get('categories', 'CategoryController@getCategory');

Route::prefix('admin')->group(function () {
    Route::middleware(['jwt-auth'])->group(function () {
        Route::get('posts', 'PostController@getPostAdmin');
        Route::post('posts', 'PostController@save');
        Route::delete('posts/{id}', 'PostController@destroy');
        Route::patch('posts/{id}', 'PostController@restore');

        Route::get('albums', 'AlbumController@getAlbumAdmin');
        Route::post('albums', 'AlbumController@save');
        Route::delete('albums/{id}', 'AlbumController@destroy');

        Route::post('authors', 'AuthorController@save');
        Route::delete('authors/{id}', 'AuthorController@destroy');

        Route::post('categories', 'CategoryController@save');
        Route::delete('categories/{id}', 'CategoryController@destroy');
        Route::get('/test', 'UserController@getUserInfo');
    });
});
