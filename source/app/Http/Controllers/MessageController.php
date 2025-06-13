<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\RequestException;

class MessageController extends Controller
{
    private string $apiUrl = 'http://10.2.160.208/api/messages';

    public function index()
    {
        try {
            $response = Http::get($this->apiUrl);
            return response()->json($response->json(), $response->status());
        } catch (RequestException $e) {
            return response()->json(['error' => 'Fout bij ophalen van berichten', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $response = Http::get("{$this->apiUrl}/{$id}");

            if ($response->successful()) {
                return response()->json($response->json(), 200);
            }

            return response()->json(['error' => 'Bericht niet gevonden'], $response->status());
        } catch (RequestException $e) {
            return response()->json(['error' => 'Fout bij ophalen van bericht', 'details' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $response = Http::post($this->apiUrl, $request->all());

            if ($response->successful()) {
                return response()->json($response->json(), 201);
            }

            return response()->json(['error' => 'Fout bij aanmaken van bericht'], $response->status());
        } catch (RequestException $e) {
            return response()->json(['error' => 'Fout bij versturen van bericht', 'details' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $response = Http::put("{$this->apiUrl}/{$id}", $request->all());

            if ($response->successful()) {
                return response()->json($response->json(), 200);
            }

            return response()->json(['error' => 'Fout bij updaten van bericht'], $response->status());
        } catch (RequestException $e) {
            return response()->json(['error' => 'Fout bij bewerken van bericht', 'details' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $response = Http::delete("{$this->apiUrl}/{$id}");

            if ($response->successful()) {
                return response()->json(['message' => 'Bericht succesvol verwijderd'], 200);
            }

            return response()->json(['error' => 'Fout bij verwijderen van bericht'], $response->status());
        } catch (RequestException $e) {
            return response()->json(['error' => 'Fout bij verwijderen', 'details' => $e->getMessage()], 500);
        }
    }
}