<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'study_direction',
        'graduation_track',
        'interests',
        'job_preferences',
        'cv',
        'profile_complete',
    ];

    // Een student kan meerdere afspraken hebben
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    // Een student kan meerdere matches/connecties hebben
    public function connecties(): HasMany
    {
        return $this->hasMany(Connectie::class);  // Fix class name capitalization
    }
}
