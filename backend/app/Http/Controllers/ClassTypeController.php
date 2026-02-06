<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClassTypeRequest;
use App\Http\Requests\TypeClassRequest;
use App\Http\Resources\ClassTypeResource;
use App\Models\ClassType;

class ClassTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return ClassType::all()->toResourceCollection();
        $classType = ClassType::with([
            'classes' => function ($query) {
                $query->withTrashed();
            },
            'payment' => function ($query) {
                $query->withTrashed();
            }
        ])->get();

        return ClassTypeResource::collection($classType);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ClassTypeRequest $request)
    {
        $typeClass = $request->validated();
        ClassType::create($typeClass);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return ClassType::findOrFail($id)->toResource();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ClassTypeRequest $request, string $id)
    {
        $typeClass = ClassType::findOrFail($id);
        $updateData = $request->validated();
        $typeClass->update($updateData);
        return response()->json($typeClass, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        ClassType::destroy($id);
    }
}
