<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\ArtBook;
use App\Models\Gallery;
use App\Models\Poetry;
use App\Models\Video;
use App\Models\Writing;

class DashboardController extends Controller {

    public function dashboard() {

        $dashboard = new \stdClass();

        $dashboard->video_count = Video::count('id');
        $dashboard->gallery_count = Gallery::count('id');
        $dashboard->writing_count = Writing::count('id');
        $dashboard->poetry_count = Poetry::count('id');
        $dashboard->artbook_count = ArtBook::count('id');
        $dashboard->album_count = Album::count('id');

        return view('dashboard.index', compact('dashboard'));
    }
}
