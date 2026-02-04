<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\ClassType;

class PaymentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Payment::all()->toResourceCollection();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PaymentRequest $request)
    {
        $payment = $request->validated();
        
        $hasPending = Payment::where('user_id', $payment['user_id'])
            ->where('availableClasses', '>', 0)->where('class_type_id',$payment['class_type_id'])
            ->exists();

        // No se puede pagar un tipo de clase cuando ese tipo aún tiene clases pendientes
        if ($hasPending) {
            return response()->json([
                'message' => 'No puedes añadir un nuevo pago mientras tengas clases pendientes de consumir.'
            ], 409); 
        }

        $pruebaId= ClassType::where('className', "Prueba")->value("id");
        $hasPrueba = Payment::where('user_id', $payment['user_id'])->where('class_type_id', $pruebaId)->exists();

        // No puedes contratar más de una clase de prueba por usuario
        if ($hasPrueba && $payment['class_type_id'] == $pruebaId){
              return response()->json([
                'message' => 'No puedes contratar más de una clase de prueba'
            ], 422);

        }

        Payment::create($payment);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Payment::findOrFail($id)->toResource();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PaymentRequest $request, string $id)
    {
        $payment = Payment::finOrFail($id);
        $updateData = $request->validated();
        $payment->update($updateData);
        return response()->json($payment, 200);
    }


    public function userPayment(string $user_id)
    {
        $payments = Payment::where('user_id', $user_id)->orderBy('availableClasses', 'desc')->get();
        return PaymentResource::collection($payments);
    }
}
