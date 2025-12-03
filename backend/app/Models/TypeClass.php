<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TypeClass extends Model
{
    use HasFactory;

    protected $table = 'type_of_classes';
    
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
