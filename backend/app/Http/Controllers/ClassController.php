<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Http\Controllers\Controller;
use App\Http\Requests\ClassRequest;
use App\Http\Resources\ClassesResource;

class ClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Classes::all()->toResourceCollection();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ClassRequest $request)
    {
        $class = $request->validated();
        Classes::create($class);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $class= Classes::with('bookingclass')->findOrFail($id);
        return new ClassesResource($class);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ClassRequest $request, string $id)
    {
        $class = Classes::findOrFail($id);
        $updateData = $request->validated();
        $class->update($updateData);
        return response()->json($class, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Classes::destroy($id);
    }
}
