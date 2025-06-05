<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    // Toegestane velden bij mass-assignment
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'content',
        'timestamp',
    ];

    // Een bericht is verzonden door een gebruiker (student of bedrijf)
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    // Een bericht is ontvangen door een gebruiker (student of bedrijf)
    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
