<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassType extends Model
{
    use HasFactory , SoftDeletes;

    protected $table = 'class_types'; // QUITARLO POR CONVENCION NOSEQUE
    
    protected $fillable = [
        'className',
        'classLimit',
        'price',
        'is_available'
    ];

     public function classes(): HasMany
    {
        return $this->hasMany(Classes::class);
    }

      public function payment(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

}
