<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
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
        // return User::all()->toResourceCollection();
        $users = User::with([
            'payment' => function ($query) {
                $query->withTrashed();
            },
            'bookingClass' => function ($query) {
                $query->withTrashed();
            }
        ])->get();

        return UserResource::collection($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {

        $user = $request->validated();
        $newRoleId = $request->role_id;
        $roleIdRegistrado = Role::where('name', 'registrado')->value('id');
        $roleIdAdmin = Role::where('name', 'admin')->value('id');
        if (Auth::check()) {
            $authUser = Auth::user();
            if (!$authUser->hasRole('admin') && $newRoleId == $roleIdAdmin) {
                return response()->json([
                'message' => 'No puedes asignar el rol de admin'
            ], 403);
            }
            $roleToAssign = $newRoleId;
        } else {
            unset($user['role_id']);
            $roleToAssign = $roleIdRegistrado;
        }
        $userCreate = User::create($user);
        $userCreate->assignRole($roleToAssign);
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

        $currentRoleId = $user->roles()->first()->id;
        $newRoleId = $request->role_id;
        $newRoleName = Role::where('id', $newRoleId)->value('name');
        $isChangingRole = $newRoleId != $currentRoleId;

        // Nadie puede aplicar el rol de admin, excepto el admin
        if (!$authUser->hasRole('admin') && $isChangingRole && $newRoleName == "admin") {
            return response()->json([
                'message' => 'No puedes asignar el rol de admin'
            ], 403);
        }
        // Nadie puede modificar su propio rol
        if ($isChangingRole && $authUser->id == $user->id) {
            return response()->json([
                'message' => 'No puedes cambiar tu propio rol.'
            ], 403);
        }

        // Solo pueden editar admin y profesor, profesor no puede editar a admin
        if ((!$authUser->hasAnyRole(['admin', 'profesor']) && $authUser->id != $user->id) || ($authUser->hasRole('profesor') && $user->hasRole('admin'))) {
            return response()->json([
                'message' => 'No tienes permiso para editar este perfil.'
            ], 403);
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
        if ((!$authUser->hasAnyRole(['admin', 'profesor'])) || ($authUser->hasRole('profesor') && $user->hasRole('admin'))) {
            return response()->json([
                'message' => 'No tienes permiso para editar este perfil.'
            ], 403);
        }
        User::destroy($id);
    }
}
