<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Http;

class AdminController extends Controller
{

    private string $apiUrl = 'http://10.2.160.208/api/';

    public function show(): View
{
    try {
        $apiStudents = $this->apiUrl . 'students';
        $apiCompanies = $this->apiUrl . 'companies';
        $apiAppointments = $this->apiUrl . 'appointments';

        $response = Http::get($apiStudents);
        if (!$response->successful()) {
            return view('voorbeeld.index', ['error' => 'API niet beschikbaar', 'students' => []]);
        }
        $students = $response->json('data');

        //Second response for companies
        $response = Http::get($apiCompanies);
        if (!$response->successful()) {
            return view('voorbeeld.index', ['error' => 'API niet beschikbaar', 'students' => []]);
        }
        $companies = $response->json('data');

        //Final response for apointments
        $response = Http::get($apiAppointments);
        if (!$response->successful()) {
            dd($apiAppointments);
            return view('voorbeeld.index', ['error' => 'API niet beschikbaar', 'students' => []]);
        }
        $appointments = $response->json('data');

        return view('/admin/admin', [
            'students' => $students, 
            'companies' => $companies,
            'appointments' => $appointments
    ]);
    } catch (\Exception $e) {
        dd('failure');
        return view('voorbeeld.index', ['error' => 'Er is een fout opgetreden', 'students' => []]);
    }
}
#Code created by copilot
#Function to store students the admin created
public function storeS(Request $request)
    {
        try {
            $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'graduation_track' => 'required|string|max:255',
            'study_direction' => 'required|string|max:255',
            'password1' => 'required|string|min:8',
            'password2' => 'required|same:password1'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Validatie mislukt: ' . $e->getMessage());
        }
        

    // Prepare data for API (use password2 as password)
    $data = [
        'firstName' => $validated['firstName'],
        'lastName' => $validated['lastName'],
        'email' => $validated['email'],
        'password' => $validated['password2'],
        'graduation_track' => $validated['graduation_track'],
        'study_direction' => $validated['study_direction'],
        'interests' => 'Ik heb interesse in...',
        'job_preferences' => 'Ik heb voorkeuren voor...',
        'cv' => 'cv.pdf',
        'profile_complete' => '0',
    ];

try {
    $response = Http::post($this->apiUrl . 'students', $data);

    if ($response->successful()) {
        return redirect()->back()->with('success', 'Student succesvol toegevoegd!');
    } else {
        // Voeg de response body toe aan de foutmelding voor debugging
        return redirect()->back()->with('error', 'Fout bij toevoegen van Student: ' . $response->body());
    }
} catch (\Exception $e) {
    return redirect()->back()->with('error', 'Er is een fout opgetreden: ' . $e->getMessage());
}
    }


}
