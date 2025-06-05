<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Connectie extends Model
{
    protected $fillable = [
        'student_id',
        'company_id',
        'status',
    ];

    // Relaties (optioneel)
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
