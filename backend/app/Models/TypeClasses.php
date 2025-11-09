<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeClasses extends Model
{
    use HasFactory;

    protected $table = 'type_of_classes';
    
    protected $fillable = [
        'className',
        'classLimit',
        'price'
    ];
}
