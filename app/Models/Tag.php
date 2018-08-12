<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Entity;

class Tag extends Model {
    use Entity;

    protected $table = 'tags';

    protected $fillable = ['name'];

    public function posts()
    {
        return $this->belongsToMany('App\Models\Post', 'post_tag', 'post_id', 'tag_id');
    }

    public function albums()
    {
        return $this->belongsToMany('App\Models\Album', 'album_tag', 'album_id', 'tag_id');
    }
}
