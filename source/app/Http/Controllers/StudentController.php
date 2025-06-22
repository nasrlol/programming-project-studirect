<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\MessageController;

class StudentController extends Controller
{


    //Function that shows only one specific student, and all of the companies. To be used by the students page
    public function index(string $id)
    {
        // Check if user is authenticated
        if (!session('api_token')) {
            return redirect()->route('student.login.form');
        }

        $token = "Bearer " . session("api_token");

        $response = Http::withHeaders([
            "Authorization" => $token
        ])->get("{$this->studentsApiUrl}/{$id}");
        //If the student is not found, user can go back to welcome page
        if (!$response->successful()) {
            return view('notfound', ['message' => 'Deze student lijkt niet te bestaan (error code 404). Contacteer de beheerder van de site voor meer informatie']);
        }
        //One student exists, so Array just consists of all the keys and their values
        $student = $response->json('data');

        $response = Http::withHeaders([
            "Authorization" => $token
        ])->get($this->companiesApiUrl);
        if (!$response->successful()) {
            return view('notfound', ['message' => 'Technisch probleem bij ophalen server (error code 404). Contacteer de beheerder van de site voor meer informatie']);
        }

        $companies = $response->json('data');

        // Get liked companies for the message list
        $likedCompanies = $this->getLikedCompanies($id, $token);
        foreach ($companies as $company) { 
            foreach ($likedCompanies as $lCompany) {
                if ($lCompany['id'] == $company['id']) {
                    $key = array_search($company, $companies);
                    array_splice( $companies, $key,1);
                }
            }
        }

        $response = Http::withHeaders([
            "Authorization" => $token
        ])->get("{$this->appointmentApiUrl}");
        //get all appointments where the student is involved
        $appointments = $response->json('data');
        //Checks which appointments belong to the student
        $appointments = collect($appointments)->where('student_id', $id)->all();

        //Gives names to the ID's
        foreach ($appointments as &$appointment) {
            //translate student and company id to names
            $appointment['student_name'] = $this->translateStudent($appointment['student_id'], $token);


            $appointment['company_name'] = $this->translateCompany($appointment['company_id'], $token);
        }

        $connectionController = new \App\Http\Controllers\ConnectionController();
        $connections = $connectionController->getConnections($id, 'student');

        // get all messages for this student
        $messageController = new MessageController();
        $allMessages = $messageController->getAllMessagesForStudent($id);

        // fetch diplomas for graduation track dropdown
        $diplomasResponse = Http::withHeaders([
            "Authorization" => $token
        ])->get($this->diplomasApiUrl);
        if ($diplomasResponse->successful()) {
            $diplomasData = $diplomasResponse->json('data');

            // check if the data is nested like companies API
            $diplomas = isset($diplomasData['data']) ? $diplomasData['data'] : $diplomasData;
        } else {
            $diplomas = [];
        }

        return view('student.html.student', [
            'id' => $id,
            'student' => $student,
            'companies' => $companies, // All companies for swiping
            'likedCompanies' => $likedCompanies, // Only liked companies for message list
            'appointments' => $appointments,
            'connections' => $connections,
            'allMessages' => $allMessages,
            'diplomas' => $diplomas
        ]);

    }

     public function indexTest()
    {
        $id = 13;
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

        $connectionController = new \App\Http\Controllers\ConnectionController();
        $connections = $connectionController->getConnections($id, 'student');

        // Get all messages for this student
        $messageController = new MessageController();
        $allMessages = $messageController->getAllMessagesForStudent($id);

        // fetch diplomas for graduation track dropdown
        $diplomasResponse = Http::get($this->diplomasApiUrl);
        if ($diplomasResponse->successful()) {
            $diplomasData = $diplomasResponse->json('data');
            // Check if the data is nested like companies API
            $diplomas = isset($diplomasData['data']) ? $diplomasData['data'] : $diplomasData;
        } else {
            $diplomas = [];
        }

        return view('student.html.student', [
            'student' => $student,
            'companies' => $companies,
            'appointments' => $appointments,
            'connections' => $connections,
            'allMessages' => $allMessages,
            'diplomas' => $diplomas
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
    else {
        return redirect()->back()->with('error', 'Er is een fout opgetreden bij het aanmaken van het account.');
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
            'email' => 'sometimes|required|email|unique:students,email',
            'password' => 'sometimes|required|string|min:8',
            'study_direction' => 'sometimes|required|string|max:255',
            'graduation_track' => 'sometimes|required|integer',
            'interests' => 'sometimes|required|string',
            'job_preferences' => 'sometimes|required|string',
            'cv' => 'nullable|string',
            'profile_complete' => 'nullable|boolean',
        ]);
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Validation failed: ' . $e->getMessage()], 422);
            }
            return redirect()->back()->with('error', 'Validatie mislukt: ' . $e->getMessage());
        }

        try {
            //Current data is taken and merged with the validated data
            $current = Http::get("{$this->studentsApiUrl}/{$id}");
            if (!$current->successful()) {
                throw new \Exception('Could not fetch current student data');
            }

            $currentData = $current->json('data');
            $data = array_merge($currentData, $validated);

            // Remove password field if it is not set in the request
            if (!isset($validated['password'])) {
                unset($data['password']);
            }

            $response = Http::patch("{$this->studentsApiUrl}/{$id}", $data);

            if (!$response->successful()) {
                throw new \Exception('API update failed');
            }

            if ($request->expectsJson()) {
                return response()->json(['success' => true, 'message' => 'Profile updated successfully']);
            }

            return redirect()->back()->with('success', 'Account succesvol aangepast');

        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Er is een fout opgetreden bij het bijwerken van het account.'], 500);
            }
            return redirect()->back()->with('error', 'Er is een fout opgetreden bij het bijwerken van het account.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, Request $request)
    {
        $token = "Bearer " . $request['token'];
        $response = Http::withHeaders( [
            "Authorization" => $token
        ])->delete("{$this->studentsApiUrl}/{$id}");

        return redirect()->back()->with('success', 'Account succesvol verwijderd!');
    }

    /**
     * Get companies that the student has liked (status = true in connections)
     *
     * @param string $student_id
     * @param string $token
     * @return array
     */
    protected function getLikedCompanies(string $student_id, string $token): array
    {
        try {
            // Get all connections for this student using ConnectionController
            $connectionController = new \App\Http\Controllers\ConnectionController();
            $connections = $connectionController->getConnections($student_id, 'student');

            // If no connections from API, try session backup
            $likedCompanyIds = [];

            if (empty($connections)) {
                // Fallback to session storage
                $sessionKey = "liked_companies_student_{$student_id}";
                $likedCompanyIds = session($sessionKey, []);
            } else {
                // Filter to only liked connections (status = true)
                $likedConnections = collect($connections)->where('status', true)->all();

                if (empty($likedConnections)) {
                    return [];
                }

                // Get company IDs that were liked
                $likedCompanyIds = collect($likedConnections)->pluck('company_id')->toArray();
            }

            if (empty($likedCompanyIds)) {
                return [];
            }

            // Fetch all companies
            $response = Http::withHeaders([
                "Authorization" => $token
            ])->get($this->companiesApiUrl);

            if (!$response->successful()) {
                return [];
            }

            $allCompanies = $response->json('data');

            // Filter companies to only include liked ones
            $likedCompanies = collect($allCompanies)
                ->whereIn('id', $likedCompanyIds)
                ->values()
                ->toArray();

            return $likedCompanies;

        } catch (\Exception $e) {
            return [];
        }
    }
}
