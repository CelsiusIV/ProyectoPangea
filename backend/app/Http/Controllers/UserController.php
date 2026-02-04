<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return User::all()->toResourceCollection();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {

        $user = $request->validated();
        $userCreate = User::create($user);
        $userCreate->assignRole('registrado');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        if ($user->hasRole('alumno')) {
            return User::findOrFail($user->id)->toResource();
        }
        return User::findOrFail($id)->toResource();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, string $id)
    {
        $user = User::findOrFail($id);
        $authUser = Auth::user();

        $currentRoleId= $user->roles()->first()->id;
        $newRoleId = $request->role_id;
        $newRoleName = Role::where('id',$newRoleId)->value('name');
        $isChangingRole= $newRoleId != $currentRoleId;

        // Nadie puede aplicar el rol de admin, excepto el admin
        if (!$authUser->hasRole('admin') && $isChangingRole && $newRoleName == "admin"){
             abort(403, 'No puedes asignar el rol de admin');
        }
        // Nadie puede modificar su propio rol
        if($isChangingRole && $authUser->id == $user->id){
            abort(403, 'No puedes cambiar tu propio rol.');
        }

        // Solo pueden editar admin y profesor, profesor no puede editar a admin
        if ((!$authUser->hasAnyRole(['admin', 'profesor']) && $authUser->id != $user->id) || ($authUser->hasRole('profesor') && $user->hasRole('admin'))) {
            abort(403, 'No tienes permiso para editar este perfil.');
        }
        //$updateData = $request->validated();
        $updateData = $request->safe()->except(['role_id']);

        $user->update($updateData);
        if ($request->has('role_id')) {
            $user->syncRoles($request->role_id);
        }
        $role = $user->roles->first();
        $user->setAttribute('role', $role ? [
            'id' => $role->id,
            'role_name' => $role->name // 
        ] : null);
        return response()->json($user, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $authUser = Auth::user();

        // Solo pueden borrar usuarios los admin y profesores. Los profesores no pueden borrar a los admins.
        if ((!$authUser->hasAnyRole(['admin', 'profesor']) ) || ($authUser->hasRole('profesor') && $user->hasRole('admin'))) {
            abort(403, 'No tienes permiso para editar este perfil.');
        }
        User::destroy($id);
    }
}
