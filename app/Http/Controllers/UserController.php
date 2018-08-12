<?php
namespace App\Http\Controllers;

use App\Models\User;
use Hash;
use Auth;
use JWTAuth;
use JWTAuthException;
use Illuminate\Http\Request;

class UserController extends Controller
{   
    private $user;

    public function __construct(User $user){
        $this->user = $user;
    }
   
    public function register(Request $request){
        $user = User::firstOrNew(
            ['email' => $request->email],
            ['name' => $request->name, 'password' => Hash::make($request->password)]
        );

        if (!$user->id) {
            $user->save();
            $token = JWTAuth::fromUser($user);
            return $this->respondWithToken($token);
        }

        return response()->json([
            'status' => 422,
            'message' => 'Email already exists.'
        ], 422);
    }
    public function login(Request $request){
        $credentials = $request->only('email', 'password');
        $token = null;
        try {
           if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['invalid_email_or_password'], 422);
           }
        } catch (JWTAuthException $e) {
            return response()->json(['failed_to_create_token'], 500);
        }
        return $this->respondWithToken($token);
    }

    protected function respondWithToken($token)
    {
        $payload = JWTAuth::getPayload($token);
        $expires_in = $payload['exp'];
        return response()->json([
            'token' => $token,
            'expires_in' => $expires_in
        ]);
    }

    public static function getUserInfo(Request $request){
        return JWTAuth::toUser($request->header('token'));
    }
}  