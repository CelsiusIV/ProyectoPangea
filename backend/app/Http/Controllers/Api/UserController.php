<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
{
    $users = User::all();

    return response()->json([
        'status' => true,
        'data' => $users
    ], 200);
}
}
