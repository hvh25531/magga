<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Album;
use App\Models\Category;
use App\Traits\SavePicture;
use Illuminate\Http\Request;

class CategoryController extends Controller {
  use SavePicture;

  /* function __construct() {
    $this->mod = new Category();
  } */

  public function getCategory(Request $request) {
    $page             = $request->page;
    $take             = $request->limit;
    $skip             = ($page - 1) * $take;
    $categories      = Category::orderBy('id', 'desc')
                        ->skip($skip)
                        ->take($take)
                        ->get();
    
    return compact('categories', 'total_categories');
  }

  public function save(Request $request) {
    // "data:image/png;base64,BBBFBfj42Pj4"
    $id = $request->id;
    $request['slug'] = str_slug($request->name);
    $image = $request->image;
    if ($image) {
      if (strpos($image, 'data:image') !== FALSE) {
        $base_to_php = explode(',', $image);
        $image = base64_decode($base_to_php[1]);
      }
      
      $res = $this->savePicture($image);

      if ($res->success) {
        $img_link = $res->data->link;
        $request['image'] = $img_link;

        if ($id) {
          Category::where('id', $id)->update($request->all());
        } else {
          $cat = Category::create($request->all());
        }
        return [ 'success' => true ];
      }
      return (array) $res;
    } else {
      Category::where('id', $id)->update($request->except('image'));
      return ['success' => true];
    }
  }

  public function destroy(Request $request) {
    $id = $request->id;
    Category::find($id)->delete();
    Album::where('category_id', $id)->update(['category_id', null]);
    Post::where('category_id', $id)->update(['category_id', null]);
  }

  public function store(Request $request, Category $category) {
    $this->savePicture($request, $category);
    $category->save();
  }

  public function update(Request $request, Category $category) {
    $this->savePicture($request, $category);
    $category->updateBy();
    $category->update($request->all());
  }

  public function categorys() {
    return $this->mod->orderBy('id', 'DESC')->get();
  }

  public function category(Request $request,$id) {
    return Category::find($id);
  }
}
