<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookingClass extends Model
{
    use SoftDeletes;
    
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
