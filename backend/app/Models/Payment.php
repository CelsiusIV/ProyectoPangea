<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
   protected $fillable = [
    'paymentDate',
    'availableClasses'
   ];

   public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    
   public function typeclass(): BelongsTo
    {
        return $this->belongsTo(ClassType::class);
    }
}
