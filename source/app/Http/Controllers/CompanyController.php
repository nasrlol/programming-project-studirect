<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Http;

class CompanyController extends Controller
{
    private string $apiUrl = 'http://10.2.160.208/api/companies/';

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



    //
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            // unique email must be fixed
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
        //some values are standard
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => $validated['password1'],
        'plan_type' => $validated['plan_type'],
        'description' => 'Onze missie als bedrijf is...',
        'job_types' => 'full-time',
        'job_domain' => 'Software-engineering ',
        'booth_location' => $validated['booth_location'],
        'photo' => 'index.png',
        'speeddate_duration' => '5',
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


    //---------------------------Aanpassingen moeten nog gebeuren aan Update----------------------------------
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|unique|email|max:255',
            'plan_type' => 'required|string',
            'booth_location' => 'required|string|max:255',
            'password1' => 'required|string|min:8',
            'password2' => 'required|same:password1'
        ]);

        $response = Http::put("{$this->apiUrl}/{$id}", $validated);

        if ($response->successful()) {
            return response()->json($response->json());
        } else {
            return response()->json(['message' => 'Student not found'], 404);
        }
    }





        /**
     * Remove the specified resource from storage.
     */ 
    public function destroy(string $id)
    {
        $response = Http::delete("{$this->apiUrl}{$id}");

        if ($response->successful()) {
            return redirect()->back()->with('success', 'Bedrijf succesvol verwijderd!');
        } else {
            return redirect()->back()->with('error', 'Fout bij verwijderen bedrijf: ' . $response->body());
        }
    }
}
