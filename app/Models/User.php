<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use App\Traits\Entity;

class User extends Model implements AuthenticatableContract,
                                    AuthorizableContract,
                                    CanResetPasswordContract
{
    use Authenticatable, Authorizable, CanResetPassword;
    use Entity;

    protected $table = 'users';

    protected $fillable = ['name', 'email', 'username', 'password', 'avatar', 'role_id'];

    protected $hidden = ['password', 'remember_token'];

    public function setPasswordAttribute($pass) {
        $this->attributes['password'] = bcrypt($pass);
    }

    public function posts()
    {
        return $this->hasMany('App\Models\Post', 'user_id', 'id');
    }

    public function albums()
    {
        return $this->hasMany('App\Models\Album', 'user_id', 'id');
    }

    public function role() {
        return $this->belongsTo('App\Models\Role', 'role_id', 'id');
    }

}
