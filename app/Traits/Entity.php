<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait Entity {
    public function deleteBy() {
        $this->deleted_by = Auth::user()->id;
        $this->save();
        $this->delete();
    }

    public function updateBy() {
        $this->updated_by = Auth::user()->id;
    }

    public function addBy() {
        $this->updateBy();
    }

    public function className() {
        $path = explode('\\', get_class($this));
        return $path[count($path)-1];
    }
}