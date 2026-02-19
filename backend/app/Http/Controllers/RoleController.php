<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoleRequest;
use App\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Role::all()->toResourceCollection();
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Role::findOrFail($id)->toResource();
    }


}
