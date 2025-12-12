<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classes extends Model
{
    protected $fillable = [
        'beginDate',
        'endDate',
        'maxStudents',
        'class_type_id'
    ];

    public function bookingclass(): HasMany
    {
        return $this->hasMany(BookingClass::class);
    }

    public function classType(): BelongsTo{
        return $this->belongsTo(ClassType::class);
    }
}
