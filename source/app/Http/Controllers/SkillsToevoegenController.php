<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;

class SkillsToevoegenController extends Controller
{
    protected string $skillsApiUrl = 'http://10.2.160.208/api/skills';
    protected string $studentsApiUrl = 'http://10.2.160.208/api/students';

    /**
     * Show the form for adding skills to a student.
     */
    public function showSkillsForm(string $id): View
    {
        // Haal de student op om te controleren of die bestaat
        $studentResponse = Http::get("{$this->studentsApiUrl}/{$id}");
        
        if (!$studentResponse->successful()) {
            return view('notfound', ['message' => 'Deze student lijkt niet te bestaan (error code 404). Contacteer de beheerder van de site voor meer informatie']);
        }
        
        $student = $studentResponse->json('data');
        
        // Beschikbare skills ophalen via de API
        $skillsResponse = Http::get($this->skillsApiUrl);
        
        if ($skillsResponse->successful()) {
            $availableSkills = $skillsResponse->json('data');
        } else {
            Log::warning('Kon geen skills ophalen, gebruik fallback waarden');
            // Fallback skills als de API niet beschikbaar is
            $availableSkills = [
                ['id' => 1, 'name' => 'PHP'],
                ['id' => 2, 'name' => 'JavaScript'],
                ['id' => 3, 'name' => 'HTML/CSS'],
                ['id' => 4, 'name' => 'React'],
                ['id' => 5, 'name' => 'Vue.js'],
                ['id' => 6, 'name' => 'Angular'],
                ['id' => 7, 'name' => 'Laravel']
            ];
        }
        
        // Haal de huidige skills van de student op (als die er zijn)
        $currentSkills = [];
        if (isset($student['skills']) && is_array($student['skills'])) {
            $currentSkills = $student['skills'];
        }
        
        return view('student.register.skillstoevoegen', [
            'student' => $student,
            'availableSkills' => $availableSkills,
            'currentSkills' => $currentSkills
        ]);
    }

    /**
     * Save the selected skills for a student.
     */
    
    public function saveSkills(Request $request, string $id): RedirectResponse
    {
        $validated = $request->validate([
            'skill_ids' => 'required|array',
            'skill_ids.*' => 'integer'
        ]);
        
        // Haal de geselecteerde skill IDs op als een gewone array
        $skillIds = $validated['skill_ids'];
        
        Log::info('Skills versturen naar API:', ['skills' => $skillIds]);
        
        // OPLOSSING: Stuur de data in het juiste formaat
        $response = Http::post("{$this->studentsApiUrl}/{$id}/skills", [
            'skill_ids' => $skillIds  // Gebruik de API endpoint voor skills
        ]);
        
        if (!$response->successful()) {
            Log::error('Fout bij opslaan skills: ' . $response->status() . ' - ' . $response->body());
            return redirect()->back()
                ->withErrors(['api' => 'Kon skills niet opslaan: ' . $response->body()])
                ->withInput();
        }
        
        // Redirect naar de login pagina met succes bericht
        return redirect()->route('login.login')
            ->with('status', 'Je profiel en skills zijn succesvol aangemaakt!');
    }
}