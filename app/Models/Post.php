<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Entity;

class Post extends Model {
    use Entity;
    use SoftDeletes;

    protected $table = 'posts';
    protected $dates = ['deleted_at'];
    protected $hidden = ['album_id', 'author_id', 'category_id', 'deleted_at', 'is_draft'];
    protected $guarded = [];
    protected $casts = [
        'tags' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id', 'id');
    }

    public function author()
    {
        return $this->belongsTo('App\Models\Author', 'author_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo('App\Models\Category', 'category_id', 'id');
    }

    public function album()
    {
        return $this->belongsTo('App\Models\Album', 'album_id', 'id');
    }

    public function tags()
    {
        return $this->belongsToMany('App\Models\Tag', 'post_tag', 'tag_id', 'post_id');
    }
}
