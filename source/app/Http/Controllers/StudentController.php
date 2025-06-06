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
    }

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
}
