<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Entity;

class Album extends Model {
    use Entity;

    protected $table = 'albums';
    protected $guarded = [];

    public function posts()
    {
        return $this->hasMany('App\Models\Post', 'album_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo('App\Models\Category', 'category_id', 'id');
    }

    public function author()
    {
        return $this->belongsTo('App\Models\Author', 'author_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id', 'id');
    }
}
