<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BookingClass extends Model
{
    protected $fillable = [
        'attendance'
    ];

    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }

    public function classes(): BelongsTo{
        return $this->belongsTo(Classes::class);
    }
}
