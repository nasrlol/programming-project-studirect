<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Http;

class StudentController extends Controller
{
    

    //Function that shows only one specific student, and all of the companies. To be used by the students page
    public function index(string $id)
    {
        $response = Http::get("{$this->studentsApiUrl}/{$id}");
        //If the student is not found, user can go back to welcome page
        if (!$response->successful()) {
            return view('notfound', ['message' => 'Deze student lijkt niet te bestaan (error code 404). Contacteer de beheerder van de site voor meer informatie']);
        } 
        //One student exists, so Array just consists of all the keys and their values
        $student = $response->json('data');

        $response = Http::get($this->companiesApiUrl);
        if (!$response->successful()) {
            return view('notfound', ['message' => 'Technisch probleem bij ophalen server (error code 404). Contacteer de beheerder van de site voor meer informatie']);
        }

        $companies = $response->json('data');

        $response = Http::get("{$this->appointmentApiUrl}");
        //get all appointments where the student is involved
        $appointments = $response->json('data');
        //Checks which appointments belong to the student
        $appointments = collect($appointments)->where('student_id', $id)->all();

        //Gives names to the ID's
        foreach ($appointments as &$appointment) {
            //translate student and company id to names
            $appointment['student_name'] = $this->translateStudent($appointment['student_id']);

            
            $appointment['company_name'] = $this->translateCompany($appointment['company_id']);
        }


        return view('student.html.student', [
            'student' => $student,
            'companies' => $companies,
            'appointments' => $appointments
        ]);

    }

     public function indexTest()
    {
        $id = 3;
        $response = Http::get("{$this->studentsApiUrl}/{$id}");
        //If the student is not found, user can go back to welcome page
        if (!$response->successful()) {
            return view('notfound', ['message' => 'Deze student lijkt niet te bestaan (error code 404). Contacteer de beheerder van de site voor meer informatie']);
        } 
        //One student exists, so Array just consists of all the keys and their values
        $student = $response->json('data');

        $response = Http::get($this->companiesApiUrl);
        if (!$response->successful()) {
            return view('notfound', ['message' => 'Technisch probleem bij ophalen server (error code 404). Contacteer de beheerder van de site voor meer informatie']);
        }

        $companies = $response->json('data');
        //get all appointments where the student is involved
        $response = Http::get("{$this->appointmentApiUrl}");

        $appointments = $response->json('data');
        //Checks which appointments belong to the student
        $appointments = collect($appointments)->where('student_id', $id)->all();

        //Gives names to the ID's
        foreach ($appointments as &$appointment) {
            //translate student and company id to names
            $appointment['student_name'] = $this->translateStudent($appointment['student_id']);

            
            $appointment['company_name'] = $this->translateCompany($appointment['company_id']);
        }

        return view('student.html.student', [
            'student' => $student,
            'companies' => $companies,
            'appointments' => $appointments
        ]);

    }

    //Function that shows all students. To be used by the admin page
    public function showAll()
{
    try {
        // data studenten ophalen
        $response = Http::get($this->studentsApiUrl);
        if (!$response->successful()) {
            return view('student.html.student', [
                'error' => 'Studenten API niet beschikbaar',
                'students' => [],
                'companies' => []
            ]);
        }
        $students = $response->json('data');

        // data bedrijven ophalen
        $response = Http::get($this->companiesApiUrl);
        if (!$response->successful()) {
            return view('student.html.student', [
                'error' => 'Bedrijven API niet beschikbaar',
                'students' => [],
                'companies' => []
            ]);
        }
        $companies = $response->json('data');

        return view('student.html.student', [
            'students' => $students,
            'companies' => $companies
        ]);
    } catch (\Exception $e) {
        return view('voorbeeld.index', ['error' => 'Er is een fout opgetreden', 'students' => []]);
    }
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email',
            //password 1 and 2 for validation
            'password1' => 'required|string|min:8',
            'password2' => 'required|same:password1',
            'study_direction' => 'required|string|max:255', // Nu verplicht
            'graduation_track' => 'required|string|max:255', // Nu verplicht
            'interests' => 'nullable|string',
            'job_preferences' => 'nullable|string',
            'cv' => 'nullable|string',
            'profile_complete' => 'nullable|boolean',
        ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Validatie mislukt: ' . $e->getMessage());
        }

        // Standaardwaarden alleen voor optionele velden
        $defaults = [
            'interests' => 'Nog niet ingevuld',
            'job_preferences' => 'Nog niet ingevuld',
            'profile_complete' => false
        ];

        foreach ($defaults as $field => $value) {
            if (!isset($validated[$field])) {
                $validated[$field] = $value;
            }
        }
        //Code block generated by coPilot
        // User password2 as password
        $validated['password'] = $validated['password2'];
        // remove password1 and password2 from the validated data
        unset($validated['password1'], $validated['password2']);
        try {
            $response = Http::post($this->studentsApiUrl, $validated);

            if ($response->successful()) {
                return redirect()->back()->with('success', 'Account succesvol aangemaakt!');
    } 
} catch (\Exception $e) {
    return redirect()->back()->with('error', 'Er is een fout opgetreden: ' . $e->getMessage());
}
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|required|email',
            'password' => 'sometimes|required|string|min:8',
            'study_direction' => 'sometimes|required|string|max:255',
            'graduation_track' => 'sometimes|required|string|max:255',
            'interests' => 'sometimes|required|string',
            'job_preferences' => 'sometimes|required|string',
            'cv' => 'nullable|string',
            'profile_complete' => 'nullable|boolean',
        ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Validatie mislukt: ' . $e->getMessage());
        }
        //Current data is taken and merged with the validated data
        $current = Http::get("{$this->studentsApiUrl}/{$id}");
        $current = $current->json('data');

        $data = array_merge($current, $validated);
        unset($data['password']); // Remove password field if it is not set in the request

        //Password hashing issue, please fix

        $response = Http::patch("{$this->studentsApiUrl}/{$id}", $data);

        if (!$response->successful()) {
            return redirect()->back()->with('error', 'Er is een fout opgetreden bij het bijwerken van het account.');
        }

        return redirect()->back()->with('success', 'Account succesvol aangepast');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $response = Http::delete("{$this->studentsApiUrl}/{$id}");

        return redirect()->back()->with('success', 'Account succesvol verwijderd!');
    }
}
