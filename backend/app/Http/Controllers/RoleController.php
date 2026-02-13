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

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, string $id)
    {
        $role = Role::findOrFail($id);
        $updateData = $request->validated();
        $role->update($updateData);
        return response()->json($role,200);
    }

}
