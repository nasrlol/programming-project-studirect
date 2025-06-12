<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CompanyController extends Controller
{
    private string $apiUrl = 'http://10.2.160.208/api/';
    //
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
}
