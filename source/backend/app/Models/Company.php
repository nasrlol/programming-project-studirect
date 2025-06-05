<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    // Deze velden mogen ingevuld worden via mass-assignment
    protected $fillable = [
        'name',
        'email',
        'password',
        'plan_type',
        'description',
        'job_types',
        'job_domains',
        'booth_location',
        'photo',
        'speeddate_duration',
        'is_active',
    ];

    // Relatie: een bedrijf kan meerdere afspraken hebben
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    // Relatie: een bedrijf kan meerdere matches hebben
    public function matches(): HasMany
    {
        return $this->hasMany(Match::class);
    }
}
