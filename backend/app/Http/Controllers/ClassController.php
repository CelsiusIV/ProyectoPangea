<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Http\Controllers\Controller;
use App\Http\Requests\ClassRequest;
use App\Http\Resources\ClassesResource;
use App\Models\ClassType;

class ClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $classes = Classes::with(['classType' => function ($query) {
            $query->withTrashed();
        }])->get();

        return ClassesResource::collection($classes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ClassRequest $request)
    {
        $class = $request->validated();
        $isAvailableClass = ClassType::where('id', $class['class_type_id'])->value("is_available");

        // Comprobar si la clase esta activa
        if ($isAvailableClass == 0) {
            return response()->json([
                'message' => 'Esta clase no está disponible'
            ], 422);
        }
        
        Classes::create($class);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $class = Classes::with('bookingclass')->findOrFail($id);
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
