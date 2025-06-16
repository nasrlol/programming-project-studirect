<?php
//Link AI: https://chatgpt.com/share/684fd09e-f0c0-8005-90e4-9f3e6d9cbdee
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

class MessageController extends Controller
{
    /**
     * Haal het gesprek op tussen een student en een bedrijf
     */
    public function getConversation(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'user1_id' => 'required|integer',
                'user1_type' => 'required|string',
                'user2_id' => 'required|integer',
                'user2_type' => 'required|string',
            ]);
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        }

        $messages = Message::where(function ($query) use ($validated) {
            $query->where('sender_id', $validated['user1_id'])
                  ->where('sender_type', $validated['user1_type'])
                  ->where('receiver_id', $validated['user2_id'])
                  ->where('receiver_type', $validated['user2_type']);
        })->orWhere(function ($query) use ($validated) {
            $query->where('sender_id', $validated['user2_id'])
                  ->where('sender_type', $validated['user2_type'])
                  ->where('receiver_id', $validated['user1_id'])
                  ->where('receiver_type', $validated['user1_type']);
        })
        ->orderBy('created_at', 'asc')
        ->get();

        return redirect()->back()->with('messages', $messages);
    }

    /**
     * Verzend een nieuw bericht
     */
    public function sendMessage(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'sender_id' => 'required|integer',
                'sender_type' => 'required|string',
                'receiver_id' => 'required|integer',
                'receiver_type' => 'required|string',
                'content' => 'required|string|max:1000',
            ]);
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        }

        $message = Message::create([
            'sender_id' => $validated['sender_id'],
            'sender_type' => $validated['sender_type'],
            'receiver_id' => $validated['receiver_id'],
            'receiver_type' => $validated['receiver_type'],
            'content' => $validated['content'],
        ]);

        return redirect()->back()->with('messageRes', 'Bericht succesvol verzonden!');
    }
}
