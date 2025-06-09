<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\View\View;

class StudentController extends Controller
{
<<<<<<< Updated upstream
=======
    private string $apiUrl = 'http://10.2.160.208/api/';

>>>>>>> Stashed changes
    /**
     * Display a listing of the resource.
     */
    public function index(): View //je kan in laravel zorgen dat het niet json teruggeeft maar bladeview
    {
        $students = Student::all();
        // call API /GetAllStudents
        // receive JSON-response, parse to objects (§students)
        // send objects to View
        //return response()->json(['data' => $students]);
        return view('student.index', [
            'students' => $students, //linkerkant frontend mannen naam, rechterkant is gewoon data
        ]);
<<<<<<< Updated upstream
    }

=======
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
>>>>>>> Stashed changes
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            // Add more validation rules as needed
        ]);

        $student = Student::create($validated);

        return response()->json([
            'data' => $student,
            'message' => 'Student created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $student = Student::findOrFail($id);
            return response()->json(['data' => $student]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Student not found'], 404);
        }
    }

        //Test function for admin
    public function showAllStudents(): View
{
    try {
        $apiStudents = $this->apiUrl . 'students';
        $apiCompanies = $this->apiUrl . 'companys';
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

        return view('/admin/html/admin', [
            'students' => $students, 
            'companies' => $companies
    ]);
    } catch (\Exception $e) {
        dd('failure');
        return view('voorbeeld.index', ['error' => 'Er is een fout opgetreden', 'students' => []]);
    }
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $student = Student::findOrFail($id);

            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|unique:students,email',
                'password' => 'required|string|min:8',
                'study_direction' => 'required|string|max:255',
                'graduation_track' => 'required|string|max:255',
                'interests' => 'required|string',
                'job_preferences' => 'required|string',
                'cv' => 'nullable|string',
                'profile_complete' => 'boolean',
            ]);

            $student->update($validated);

            return response()->json([
                'data' => $student,
                'message' => 'Student updated successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Student not found'], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $student = Student::findOrFail($id);
            $student->delete();

            return response()->json([
                'message' => 'Student deleted successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Student not found'], 404);
        }
    }
<<<<<<< Updated upstream
}
=======
    public function adminIndex(): View
{
    try {
        $response = Http::get($this->apiUrl);

        if (!$response->successful()) {
            return view('admin.html.admin', ['error' => 'API niet beschikbaar', 'students' => []]);
        }

        $students = $response->json('data');
        return view('admin.html.admin', ['students' => $students]);
    } catch (\Exception $e) {
        return view('admin.html.admin', ['error' => 'Er is een fout opgetreden: ' . $e->getMessage(), 'students' => []]);
    }
}
}
>>>>>>> Stashed changes
