<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Http;

class StudentController extends Controller
{
    private string $apiUrl = 'http://127.0.0.1:8001/api/students';

    /**
     * Display a listing of the resource.
     */
    /*public function index(): View
    {
        $response = Http::get($this->apiUrl);
        $students = $response->json('data');

        return view('student.index', [
            'students' => $students,
        ]);
    }*/

    public function index(): View
{
    try {
        $response = Http::get($this->apiUrl);
        
        if (!$response->successful()) {
            return view('voorbeeld.index', ['error' => 'API niet beschikbaar', 'students' => []]);
        }
        
        $students = $response->json('data');
        return view('voorbeeld.index', ['students' => $students]);
    } catch (\Exception $e) {
        return view('voorbeeld.index', ['error' => 'Er is een fout opgetreden', 'students' => []]);
    }
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|string|min:8',
            'study_direction' => 'required|string|max:255',
            'graduation_track' => 'required|string|max:255',
            'interests' => 'required|string',
            'job_preferences' => 'required|string',
            'cv' => 'nullable|string',
            'profile_complete' => 'boolean',
        ]);

        $response = Http::post($this->apiUrl, $validated);

        return response()->json($response->json(), $response->status());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $response = Http::get("{$this->apiUrl}/{$id}");

        if ($response->successful()) {
            return response()->json($response->json());
        } else {
            return response()->json(['message' => 'Student not found'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email',
            'password' => 'sometimes|required|string|min:8',
            'study_direction' => 'sometimes|required|string|max:255',
            'graduation_track' => 'sometimes|required|string|max:255',
            'interests' => 'sometimes|required|string',
            'job_preferences' => 'sometimes|required|string',
            'cv' => 'nullable|string',
            'profile_complete' => 'boolean',
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
    public function destroy(string $id): JsonResponse
    {
        $response = Http::delete("{$this->apiUrl}/{$id}");

        if ($response->successful()) {
            return response()->json($response->json());
        } else {
            return response()->json(['message' => 'Student not found'], 404);
        }
    }
}