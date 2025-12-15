<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingClass extends Model
{
    protected $fillable = [
        'class_id',
        'user_id',
        'attendance'
    ];

    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }

    public function class(): BelongsTo{
        return $this->belongsTo(Classes::class);
    }
}
