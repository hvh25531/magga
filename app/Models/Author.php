<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Entity;

class Author extends Model {
    use Entity;

    protected $table = 'authors';

    protected $fillable = ['name', 'about', 'avatar', 'slug'];

    public function posts()
    {
        return $this->hasMany('App\Models\Post', 'author_id', 'id');
    }

    public function albums()
    {
        return $this->hasMany('App\Models\Album', 'author_id', 'id');
    }
}
