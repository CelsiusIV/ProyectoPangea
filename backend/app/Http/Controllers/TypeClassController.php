<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\TypeClassRequest;
use App\Models\TypeClass;
use Illuminate\Http\Request;

class TypeClassController extends Controller
{
       /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return TypeClass::all()->toResourceCollection();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TypeClassRequest $request)
    {
        $typeClass= $request->validated();
        TypeClass::create($typeClass);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return TypeClass::findOrFail($id)->toResource();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TypeClassRequest $request, string $id)
    {
        $typeClass = TypeClass::findOrFail($id);
        $updateData = $request->validated();
        $typeClass->update($updateData);
        return response()->json($typeClass,200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        TypeClass::destroy($id);
    }
}
