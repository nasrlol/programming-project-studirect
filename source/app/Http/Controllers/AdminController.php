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
#Function to store companies the admin created
#Code created by copilot
public function storeC(Request $request)
    {
        try {
            $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|unique|email|max:255',
            'plan_type' => 'required|string',
            'booth_location' => 'required|string|max:255',
            'password1' => 'required|string|min:8',
            'password2' => 'required|same:password1'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Validatie mislukt: ' . $e->getMessage());
        }
        

    // Prepare data for API (use password1 as password)
    $data = [

        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => $validated['password1'],
        'plan_type' => $validated['plan_type'],
        'description' => 'bvrtrt',
        'job_types' => 'efrver',
        'job_domain' => 'verrtfv',
        'booth_location' => $validated['booth_location'],
        'photo' => 'index.png',
        'speeddate_duration' => '10',
    ];

try {
    $response = Http::post($this->apiUrl . 'companies', $data);

    if ($response->successful()) {
        return redirect()->back()->with('success', 'Bedrijf succesvol toegevoegd!');
    } else {
        // Voeg de response body toe aan de foutmelding voor debugging
        return redirect()->back()->with('error', 'Fout bij toevoegen bedrijf: ' . $response->body());
    }
} catch (\Exception $e) {
    return redirect()->back()->with('error', 'Er is een fout opgetreden: ' . $e->getMessage());
}
    }



#Function to store students the admin created
public function storeS(Request $request)
    {
        try {
            $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'booth_location' => 'required|string|max:255',
            'password1' => 'required|string|min:8',
            'password2' => 'required|same:password1'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Validatie mislukt: ' . $e->getMessage());
        }
        

    // Prepare data for API (use password1 as password)
    $data = [
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => $validated['password1'],
        'plan_type' => $validated['plan_type'],
        'description' => '',
        'job_types' => '',
        'job_domain' => '',
        'booth_location' => $validated['booth_location'],
        'photo' => '',
        'speeddate_duration' => '',
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ];

try {
    $response = Http::post($this->apiUrl . 'companies', $data);

    if ($response->successful()) {
        return redirect()->back()->with('success', 'Bedrijf succesvol toegevoegd!');
    } else {
        // Voeg de response body toe aan de foutmelding voor debugging
        return redirect()->back()->with('error', 'Fout bij toevoegen bedrijf: ' . $response->body());
    }
} catch (\Exception $e) {
    return redirect()->back()->with('error', 'Er is een fout opgetreden: ' . $e->getMessage());
}
    }
}
