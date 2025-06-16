<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    //apiUrls in parent class

    //Make an appointment
    function store(Request $request) {
        try {
            $validated = $request->validate([
                'student_id' => 'required|integer',
                'company_id' => 'required|integer',
                'time_slot' => 'required|string|max:100'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Er is een fout opgetreden bij het maken van de afspraak: ' . $e->getMessage());
        }
        try {
            $response = Http::post($this->appointmentApiUrl, $validated);

            return redirect()->back()->with('success', 'Afspraak succesvol gemaakt!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Er is een fout opgetreden: ' . $e->getMessage());
        }
    }
    function update(Request $request, $id) {
        try {
            $validated = $request->validate([
                'time_slot' => 'required|string|max:100'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Er is een fout opgetreden bij het bijwerken van de afspraak: ' . $e->getMessage());
        }
        try {
            $response = Http::put("{$this->appointmentApiUrl}/{$id}", $validated);

            return redirect()->back()->with('success', 'Afspraak succesvol bijgewerkt!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Er is een fout opgetreden: ' . $e->getMessage());
        }
    }
    function destroy($id) {
        try {
            $response = Http::delete("{$this->appointmentApiUrl}/{$id}");

            return redirect()->back()->with('success', 'Afspraak succesvol verwijderd!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Er is een fout opgetreden: ' . $e->getMessage());
        }
    }
}
