<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use App\Http\Resources\PaymentResource;

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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Payment::destroy($id);
    }

    public function userPayment(string $user_id){
        $payments = Payment::where('user_id', $user_id)->orderBy('availableClasses', 'desc')->get();
        return PaymentResource::collection($payments);
    }
}
