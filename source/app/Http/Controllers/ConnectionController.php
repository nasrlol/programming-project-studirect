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

        // Get authentication token from session
        $token = session('api_token');

        // Make API request with authentication if token exists
        $httpRequest = $token
            ? Http::withHeaders(['Authorization' => 'Bearer ' . $token])
            : Http::asJson();

        $response = $httpRequest->post($this->connectionsApiUrl, $data);

        if(!$response->successful()) {
            // Check if it's an AJAX request
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Er is een fout opgetreden bij het maken van de match.'
                ], 500);
            }
            return redirect()->back()->with('error', 'Er is een fout opgetreden bij het maken van de match.');
        }

        // Store in session as backup since GET connections API is failing
        $sessionKey = "liked_companies_student_{$data['student_id']}";
        $likedCompanies = session($sessionKey, []);

        if ($data['status'] === true) {
            // Add to liked companies if not already there
            if (!in_array($data['company_id'], $likedCompanies)) {
                $likedCompanies[] = $data['company_id'];
                session([$sessionKey => $likedCompanies]);
            }
        } else {
            // Remove from liked companies if disliked
            $likedCompanies = array_diff($likedCompanies, [$data['company_id']]);
            session([$sessionKey => array_values($likedCompanies)]);
        }

        // Check if it's an AJAX request
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Connection saved successfully'
            ]);
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

    /**
     * Get connections for a specific student or company
     *
     * @param int $id The ID of the student or company
     * @param string $type Either 'student' or 'company'
     * @return array Array of connections
     */
    public function getConnections($id, $type)
    {
        // Get authentication token from session
        $token = session('api_token');

        // Make API request with authentication if token exists
        $httpRequest = $token
            ? Http::withHeaders(['Authorization' => 'Bearer ' . $token])
            : Http::asJson();

        try {
            // Use the specific endpoint for the type
            $endpoint = "{$this->connectionsApiUrl}/{$type}/{$id}";
            $response = $httpRequest->get($endpoint);

            // If the API is returning errors, return empty array for now
            if (!$response->successful()) {
                return []; // Return empty array instead of crashing
            }

            $responseData = $response->json('data');
            if (!$responseData) {
                return [];
            }

            // Return the connections directly since the API already filters by type and ID
            return is_array($responseData) ? $responseData : [$responseData];

        } catch (\Exception $e) {
            return []; // Return empty array on exception
        }
    }
}
