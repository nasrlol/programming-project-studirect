<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Http;

class ConnectionController extends Controller
{
    //
    public function makeConnection(Request $request)
    {
        $data = $request->validate([
            'student_id' => 'required|integer',
            'company_id' => 'required|integer',
            'status'=> 'required|boolean'
        ]);

        $response = Http::post($this->connectionsApiUrl , $data);

        if(!$response->successful()) {
            return redirect()->back()->with('error', 'Er is een fout opgetreden bij het maken van de match.');
        }

        return redirect()->back()->with('succes', 'Gematched met bedrijf ${$this->translateCompany($request["company_id"}!');
    }
    public function removeConnection($id, Request $request)
    {
        try {
            $data = $request->validate([
            'student_id' => 'required|integer',
            'company_id' => 'required|integer'
        ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Ongeldige gegevens: ' . $e->getMessage());
        }
        $data['status'] = false; // Set status to false to indicate deactivation

        $response = Http::patch("{$this->connectionsApiUrl}/{$id}", $data);

        if (!$response->successful()) {
            return redirect()->back()->with('error', '404 not found (match niet gevonden, contacteer de beheerder).');
        }

        return redirect()->back()->with('success', 'Match succesvol gedeactiveerd!');
    }
}
