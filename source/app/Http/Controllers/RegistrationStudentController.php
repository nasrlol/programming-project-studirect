<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class RegistrationStudentController extends Controller
{
    public function debug() {
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
            return redirect()->route('student.register.step1')->withErrors(['incomplete' => 'Registratiegegevens zijn onvolledig.']);
        }

        $cvPath = $step2['cv'] ?? null;
        $cvFile = $cvPath ? Storage::path($cvPath) : null;

        $multipart = [
            ['name' => 'first_name', 'contents' => $step1['first_name']],
            ['name' => 'last_name', 'contents' => $step1['last_name']],
            ['name' => 'email', 'contents' => $step1['email']],
            ['name' => 'password', 'contents' => $step1['password']],
            ['name' => 'study_direction', 'contents' => $step1['study_direction']],
            ['name' => 'graduation_track', 'contents' => $step2['graduation_track']],
            ['name' => 'interests', 'contents' => $step2['interests'] ?? 'Nog niet ingevuld'],
            ['name' => 'linkedin', 'contents' => $step2['linkedin'] ?? ''],
            ['name' => 'job_preferences', 'contents' => $step3['job_preferences'] ?? 'Nog niet ingevuld'],
            ['name' => 'location', 'contents' => $step3['location'] ?? ''],
            ['name' => 'profile_complete', 'contents' => true],
        ];

        if ($cvFile && file_exists($cvFile)) {
            $multipart[] = [
                'name' => 'cv',
                'contents' => fopen($cvFile, 'r'),
                'filename' => basename($cvFile),
            ];
        }

        $response = Http::asMultipart()->post('https://api.jouwdomein.com/api/students', $multipart);

        if ($response->successful()) {
            session()->forget('registration.step1');
            session()->forget('registration.step2');

            return redirect()->route('student.login.form')->with('status', 'Registratie geslaagd!');
        }

        return back()->withErrors(['api' => 'Registratie mislukt. Probeer opnieuw.'])->withInput();
    }

    
}
