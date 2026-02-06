<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Classes extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'beginDate',
        'endDate',
        'maxStudents',
        'class_type_id'
    ];

    public function bookingclass(): HasMany
    {
        return $this->hasMany(BookingClass::class, 'class_id');
    }

    public function classType(): BelongsTo{
        return $this->belongsTo(ClassType::class);
    }
}
