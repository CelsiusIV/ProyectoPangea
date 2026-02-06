<?php

namespace App\Http\Controllers;

use App\Models\BookingClass;
use App\Http\Controllers\Controller;
use App\Http\Requests\BookingClassRequest;
use App\Http\Resources\BookingClassResource;
use App\Models\Classes;
use App\Models\ClassType;
use App\Models\Payment;

class BookingClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return BookingClass::all()->toResourceCollection();
        $bookingClass = BookingClass::with([
            'user' => function ($query) {
                $query->withTrashed();
            },
            'class' => function ($query) {
                $query->withTrashed();
            }
        ])->get();

        return BookingClassResource::collection($bookingClass);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BookingClassRequest $request)
    {
        $bookClass = $request->validated();
        $classSelected = Classes::findOrFail($bookClass['class_id']);
        $pruebaClass = ClassType::where('className', 'prueba')->value('id');
        $userClassPrueba = BookingClass::where('user_id', $bookClass['user_id'])->where('class_id');

        // Comprobar si el usuario ya ha consumido una clase de prueba
        if ($classSelected->class_type_id == $pruebaClass) {
            $hasTakenTrial = BookingClass::where('user_id', $bookClass['user_id'])->whereHas('class', function ($query) use ($pruebaClass) {
                $query->where('class_type_id', $pruebaClass);
            })
                ->exists();
            if ($hasTakenTrial) {
                return response()->json([
                    'message' => 'Ya ha disfrutado de tu clase de prueba gratuita y no puede reservar otra.'
                ], 422);
            }
        }
        // Comprobar si el usuario no está inscrito ya en la clase
        if (BookingClass::where('user_id', $bookClass['user_id'])->where('class_id', $classSelected->id)->count()) {
            return response()->json([
                'message' => 'Ya está apuntado a esta clase'
            ], 422);
        }
        //Comprobar si el usuario tiene saldo para reservar

        $userPaymentClass = Payment::where('user_id', $bookClass['user_id'])->where('class_type_id', $classSelected->class_type_id)->where('availableClasses', '>', 0)->first();

        if (!$userPaymentClass) {
            return response()->json([
                'message' => 'El usuario no tiene saldo disponible para esta clase.'
            ], 422);
        }

        // Comprobar si hay espacio para apuntarse
        $maxStudents = Classes::where('id', $bookClass['class_id'])->value('maxStudents');
        $totalStudentsBooking = BookingClass::where('class_id', $bookClass['class_id'])->count('user_id');

        if ($totalStudentsBooking >= $maxStudents) {
            return response()->json([
                'message' => 'No se pueden apuntar mas usuarios a esta clase, está completa.'
            ], 422);
        }

        $userPaymentClass->decrement('availableClasses');
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
        return response()->json($bookClass, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $bookClass = BookingClass::find($id);

        if ($bookClass->attendance == 1) {
            return response()->json([
                'message' => 'No se puede borrar la reserva. Ya ha sido confirmada.'
            ], 422);
        }

        $classType = Classes::where('id', $bookClass['class_id'])->value('class_type_id');
        $userPaymentClass = Payment::where('user_id', $bookClass['user_id'])->where('class_type_id', $classType)->first();
        $userPaymentClass->increment('availableClasses');


        BookingClass::destroy($id);
    }

    public function classBooking(string $class_id)
    {
        return BookingClass::where('class_id', $class_id)->get()->toResourceCollection();
    }
}
