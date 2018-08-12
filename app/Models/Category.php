<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Entity;

class Category extends Model {
    use Entity;

    protected $table = 'categories';

    protected $fillable = ['name', 'image', 'slug'];

    public function posts()
    {
        return $this->hasMany('App\Models\Post', 'category_id', 'id');
    }

    public function albums()
    {
        return $this->hasMany('App\Models\Album', 'category_id', 'id');
    }
}
