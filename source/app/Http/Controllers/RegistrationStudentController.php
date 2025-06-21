<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RegistrationStudentController extends Controller
{
    protected string $studentsApiUrl = 'http://10.2.160.208/api/students';

    public function debug()
    {
        return 'Controller werkt!';
    }

    // Stap 1: Gegevens opslaan in sessie
    public function step1(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|string|min:8',
            'study_direction' => 'required|string|max:255',
        ]);

        session(['registration.step1' => $validated]);

        return redirect()->route('student.register.step2');
    }

    // Stap 2: Gegevens opslaan in sessie
    public function step2(Request $request)
    {
        $validated = $request->validate([
            'graduation_track' => 'required|string|max:255',
            'interests' => 'nullable|string',
            'linkedin' => 'nullable|url|max:255',
            'cv' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        // CV tijdelijk opslaan
        if ($request->hasFile('cv')) {
            $validated['cv'] = $request->file('cv')->store('temp');
        }

        session(['registration.step2' => $validated]);

        return redirect()->route('student.register.step3');
    }

    // Stap 3: Verstuur alles naar backend
    public function submit(Request $request)
    {
        $request->validate([
            'job_preferences' => 'nullable|string',
            'location' => 'nullable|string',
        ]);

        $step1 = session('registration.step1');
        $step2 = session('registration.step2');
        $step3 = $request->only(['job_preferences', 'location']);

        if (!$step1 || !$step2) {
            return redirect()->route('student.register.step1')
                ->withErrors(['incomplete' => 'Registratiegegevens zijn onvolledig.']);
        }

        $cvPath = $step2['cv'] ?? null;
        $cvFile = $cvPath ? Storage::path($cvPath) : null;

        // Verzamel alle data in een array
        $data = [
            'first_name' => $step1['first_name'],
            'last_name' => $step1['last_name'],
            'email' => $step1['email'],
            'password' => $step1['password'],
            'study_direction' => $step1['study_direction'],
            'graduation_track' => $step2['graduation_track'],
            'interests' => $step2['interests'] ?? 'Nog niet ingevuld',
            'linkedin' => $step2['linkedin'] ?? '',
            'job_preferences' => $step3['job_preferences'] ?? 'Nog niet ingevuld',
            'location' => $step3['location'] ?? '',
            'profile_complete' => true,
        ];

        try {
            Log::info('Sending registration request to API: ' . $this->studentsApiUrl);

            if ($cvFile && file_exists($cvFile)) {
                // multipart als er een cv is
                $multipart = [];
                foreach ($data as $key => $value) {
                    $multipart[] = ['name' => $key, 'contents' => $value];
                }
                $multipart[] = [
                    'name' => 'cv',
                    'contents' => fopen($cvFile, 'r'),
                    'filename' => basename($cvFile),
                ];
                $response = Http::asMultipart()->post($this->studentsApiUrl, $multipart);
            } else {
                // JSON als er geen cv is
                $response = Http::post($this->studentsApiUrl, $data);
            }

            Log::info('API response status: ' . $response->status());
            Log::info('API response body: ' . $response->body());

            if ($response->successful()) {
                session()->forget('registration.step1');
                session()->forget('registration.step2');
                return redirect()->route('student.login.form')->with('status', 'Registratie geslaagd!');
            } else {
                Log::error('API Registration failed: ' . $response->status() . ' - ' . $response->body());
                $errorMsg = json_decode($response->body(), true);
                $message = isset($errorMsg['message']) ? $errorMsg['message'] : 'Registratie mislukt: ' . $response->status();
                return back()->withErrors(['api' => $message])->withInput();
            }
        } catch (\Exception $e) {
            Log::error('Exception during registration: ' . $e->getMessage());
            return back()->withErrors(['api' => 'Er is een fout opgetreden: ' . $e->getMessage()])->withInput();
        }
    }
}