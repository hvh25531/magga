<?php

namespace App\Traits;

use App\Helpers\Curl;

trait SavePicture
{
    public function savePicture($img)
    {
       $options = array(
           'method' => 'POST',
           'url' => env('IMGUR_API_ENDPOINT').'image',
           'headers' => [ 'Authorization: Bearer ' . '472e6c04bff7cd5ab42de6c799a97145eeb837bb' ],
           'body' => http_build_query([ 'image' => $img ])
        );
        return json_decode(Curl::makecall($options));
    }
}
