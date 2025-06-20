<?php
//Link AI: https://chatgpt.com/share/684fd09e-f0c0-8005-90e4-9f3e6d9cbdee
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class MessageController extends Controller
{
    /**
     * Haal het gesprek op tussen een student en een bedrijf
     */
    public function getConversation(Request $request)
    {
        try {
            $validated = $request->validate([
                'user1_id' => 'required|integer',
                'user1_type' => 'required|string',
                'user2_id' => 'required|integer',
                'user2_type' => 'required|string',
            ]);
        } catch (ValidationException $e) {
            if ($request->expectsJson()) {
                return response()->json(['errors' => $e->errors()], 422);
            }
            return redirect()->back()->withErrors($e->errors());
        }

        // API call to get conversation
        $response = Http::post("{$this->messagesApiUrl}/conversation", $validated);

        if (!$response->successful()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Failed to fetch conversation'], 500);
            }
            return redirect()->back()->withErrors(['error' => 'Failed to fetch conversation']);
        }

        $responseData = $response->json();
        $messages = $responseData['conversation'] ?? [];

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'data' => $messages
            ]);
        }

        return redirect()->back()->with('messages', $messages);
    }

    /**
     * Verzend een nieuw bericht
     */
    public function sendMessage(Request $request)
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
            if ($request->expectsJson()) {
                return response()->json(['errors' => $e->errors()], 422);
            }
            return redirect()->back()->withErrors($e->errors());
        }

        // API call to send message
        $response = Http::post("{$this->messagesApiUrl}/send", $validated);

        if (!$response->successful()) {
            $errorMessage = 'Failed to send message';
            if ($response->status() === 422) {
                $errorData = $response->json();
                $errorMessage = $errorData['message'] ?? 'Validation error';
            }

            if ($request->expectsJson()) {
                return response()->json(['error' => $errorMessage], 500);
            }
            return redirect()->back()->withErrors(['error' => $errorMessage]);
        }

        $message = $response->json('data');

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Bericht succesvol verzonden!',
                'data' => $message
            ]);
        }

        return redirect()->back()->with('messageRes', 'Bericht succesvol verzonden!');
    }

    /**
     * Haal alle berichten op voor een specifieke student
     */
    public function getAllMessagesForStudent($studentId)
    {
        // Get all companies instead of just connected ones
        $response = Http::get($this->companiesApiUrl);

        if (!$response->successful()) {
            return [];
        }

        $companiesData = $response->json('data');
        $companies = $companiesData ?? [];

        if (empty($companies)) {
            return [];
        }

        $groupedMessages = [];

        // For each company, fetch the conversation with the student
        foreach ($companies as $company) {
            $companyId = $company['id'];

            // Prepare data for conversation API call
            $conversationData = [
                'user1_id' => (int)$studentId,
                'user1_type' => 'App\\Models\\Student',
                'user2_id' => (int)$companyId,
                'user2_type' => 'App\\Models\\Company',
            ];

            // API call to get conversation between student and this company
            $response = Http::post("{$this->messagesApiUrl}/conversation", $conversationData);

            if ($response->successful()) {
                $responseData = $response->json();
                $messages = $responseData['conversation'] ?? []; // Use 'conversation' key from API response

                if (!empty($messages)) {
                    $groupedMessages[$companyId] = $messages;
                }
            }
        }

        return $groupedMessages;
    }

    /**
     * Haal alle berichten op voor een specifiek bedrijf
     */
    public function getAllMessagesForCompany($companyId)
    {
        Log::info('getAllMessagesForCompany called', ['companyId' => $companyId]);

        // Get all students instead of just connected ones
        $response = Http::get($this->studentsApiUrl);

        if (!$response->successful()) {
            Log::error('Failed to fetch students', [
                'status' => $response->status(),
                'url' => $this->studentsApiUrl
            ]);
            return [];
        }

        $studentsData = $response->json('data');
        $students = $studentsData ?? [];

        Log::info('Students fetched', ['count' => count($students)]);

        if (empty($students)) {
            Log::warning('No students found');
            return [];
        }

        $groupedMessages = [];

        // For each student, fetch the conversation with the company
        foreach ($students as $student) {
            $studentId = $student['id'];

            // Prepare data for conversation API call
            $conversationData = [
                'user1_id' => (int)$companyId,
                'user1_type' => 'App\\Models\\Company',
                'user2_id' => (int)$studentId,
                'user2_type' => 'App\\Models\\Student',
            ];

            Log::info('Making conversation API call', [
                'url' => "{$this->messagesApiUrl}/conversation",
                'data' => $conversationData
            ]);

            // API call to get conversation between company and this student
            $response = Http::post("{$this->messagesApiUrl}/conversation", $conversationData);

            Log::info('Conversation API response', [
                'student_id' => $studentId,
                'status' => $response->status(),
                'successful' => $response->successful(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                $messages = $responseData['conversation'] ?? []; // Use 'conversation' key from API response

                if (!empty($messages)) {
                    $groupedMessages[$studentId] = [
                        'user_id' => $studentId,
                        'messages' => $messages
                    ];
                    Log::info('Messages found for student', [
                        'student_id' => $studentId,
                        'message_count' => count($messages)
                    ]);
                } else {
                    Log::info('No messages found for student', ['student_id' => $studentId]);
                }
            } else {
                Log::error('Conversation API call failed', [
                    'student_id' => $studentId,
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
            }
        }

        Log::info('getAllMessagesForCompany result', [
            'total_conversations' => count($groupedMessages)
        ]);

        return $groupedMessages;
    }
}
