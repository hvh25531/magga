<?php

namespace App\Http\Controllers;


use App\Models\Tag;
use App\Traits\SavePicture;
use Illuminate\Http\Request;

class TagController extends BaseController
{

  function __construct() {
    $this->mod = new Tag();
  }

  public function store(Request $request, Tag $tag) {
    $this->savePicture($request, $tag);
    $tag->save();
  }

  public function update(Request $request, Tag $tag) {
    $this->savePicture($request, $tag);
    $tag->updateBy();
    $tag->update($request->all());
  }

  public function tags() {
    return $this->mod->orderBy('id', 'DESC')->get();
  }

  public function tag(Request $request,$id) {
    return Tag::find($id);
  }
}
