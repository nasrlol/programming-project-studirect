<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Student extends Model
{
    // Deze velden mogen via mass-assignment ingevuld worden (bijv. create())
    protected $fillable = [
        'email',
        'password',
        'study_direction',
        'graduation_track',
        'interests',
        'job_preferences',
        'cv',
        'profile_complete',
        'is_active',
    ];

    // Een student kan meerdere afspraken hebben
    
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    // Een student kan meerdere matches/connecties hebben
    public function connecties(): HasMany
    {
        return $this->hasMany(connecties::class);
    }

}
