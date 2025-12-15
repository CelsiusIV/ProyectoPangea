<?php

namespace App\Http\Controllers;

use App\Models\BookingClass;
use App\Http\Controllers\Controller;
use App\Http\Requests\BookingClassRequest;

class BookingClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return BookingClass::all()->toResourceCollection();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BookingClassRequest $request)
    {
        $bookClass= $request->validated();
        BookingClass::create($bookClass);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
       return BookingClass::findOrFail($id)->toResource();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BookingClassRequest $request, string $id)
    {
        $bookClass = BookingClass::findOrFail($id);
        $updateData = $request->validated();
        $bookClass->update($updateData);
        return response()->json($bookClass,200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        BookingClass::destroy($id);
    }
}
