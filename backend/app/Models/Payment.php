<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
   protected $fillable = [
    'user_id',
    'class_type_id',
    'paymentDate',
    'availableClasses'
   ];

   public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    
   public function classType(): BelongsTo
    {
        return $this->belongsTo(ClassType::class);
    }
}
