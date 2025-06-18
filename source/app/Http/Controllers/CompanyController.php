<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Http;

class CompanyController extends Controller
{
    //companiesApiUrls in parent class

    //Index function to shown on the company page, takes the ID and shows the company 
    public function index(string $id): View
    {
        $response = Http::get("{$this->companiesApiUrl}/{$id}");
        if (!$response->successful()) {
            return view('notfound', ['message' => 'Dit bedrijf lijkt niet te bestaan (error code 404). Contacteer de beheerder van de site voor meer informatie']);
        } 

        $company = $response->json('data');

        //get all appointments where the company is involved
        $response = Http::get("{$this->appointmentApiUrl}");
        $appointments = $response->json('data');
        $appointments = collect($appointments)->where('company_id', $id)->all();

        //Gives names to the ID's
        foreach ($appointments as &$appointment) {
            //translate student and company id to names
            $appointment['student_name'] = $this->translateStudent($appointment['student_id']);

            
            $appointment['company_name'] = $this->translateCompany($appointment['company_id']);
        }

        $connections = $this->get_connections($id, 'company');

        return view('company.company', [
            'company' => $company,
            'appointments' => $appointments,
            'connections' => $connections
        ]);
    }
    //Test Function to show a company, this will be replaced by the index function.
    public function indexTest(): View
    {
        $id = 3; //This is a test company, will be replaced by the index function
        $response = Http::get("{$this->companiesApiUrl}/{$id}");
        if (!$response->successful()) {
            return view('notfound', ['message' => 'Dit bedrijf lijkt niet te bestaan (error code 404). Contacteer de beheerder van de site voor meer informatie']);
        } 

        $company = $response->json('data');

        //get all appointments where the company is involved
        $response = Http::get("{$this->appointmentApiUrl}");
        $appointments = $response->json('data');
        $appointments = collect($appointments)->where('company_id', $id)->all();

        //Gives names to the ID's
        foreach ($appointments as &$appointment) {
            //translate student and company id to names
            $appointment['student_name'] = $this->translateStudent($appointment['student_id']);

            
            $appointment['company_name'] = $this->translateCompany($appointment['company_id']);
        }

        $connections = $this->get_connections($id, 'company');

        return view('company.company', [
            'company' => $company,
            'appointments' => $appointments,
            'connections' => $connections
        ]);
    }





    //
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            // unique email must be fixed
            'plan_type' => 'required|string',
            'booth_location' => 'required|string|max:255',
            'password1' => 'required|string|min:8',
            'password2' => 'required|same:password1',
            // Optional fields
            'company_description' => 'nullable|string|max:1000',
            'job_types' => 'nullable|string|max:255',
            'job_domain' => 'nullable|string|max:255',
            'photo' => 'nullable|image', 
            'speeddate_duration' => 'nullable|integer',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Validatie mislukt: ' . $e->getMessage());
        }

        if (isset($validated['company_description'])) {
            $validated['company_description'] = 'Vul dit in';
        }
        if (isset($validated['job_types'])) {
            $validated['job_types'] = 'Vul dit in';
        }
        if (isset($validated['job_domain'])) {
            $validated['job_domain'] = 'Vul dit in';
        }
        if (isset($validated['photo'])) {
            $validated['photo'] = 'Aan te passen';
        }
        if (isset($validated['speeddate_duration'])) {
            $validated['speeddate_duration'] = '1'; // Default value
        }
        
        //Take password 1 for value
        unset($validated['password2']);
        $validated['password'] = $validated['password1'];
        unset($validated['password1']);
    
try {
    $response = Http::post($this->companiesApiUrl, $validated);

    return redirect()->back()->with('success', 'Bedrijf succesvol toegevoegd!');

} catch (\Exception $e) {
    return redirect()->back()->with('error', 'Er is een fout opgetreden: ' . $e->getMessage());
}
    }


    //---------------------------Aanpassingen moeten nog gebeuren aan Update----------------------------------
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            // unique email must be fixed
            'plan_type' => 'sometimes|string',
            'booth_location' => 'sometimes|string|max:255',
            'password1' => 'sometimes|string|min:8',
            'password2' => 'sometimes|same:password1',
            // Optional fields
            'company_description' => 'nullable|string|max:1000',
            'job_types' => 'nullable|string|max:255',
            'job_domain' => 'nullable|string|max:255',
            'photo' => 'nullable|image', 
            'speeddate_duration' => 'nullable|integer',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Validatie mislukt: ' . $e->getMessage());
        }
        //Current data is taken and merged with the validated data
        $current = Http::get("{$this->companiesApiUrl}/{$id}");
        $current = $current->json('data');

        $data = array_merge($current, $validated);
        
        unset($data['password1']); // Remove password field if it is not set in the request
        unset($data['password2']); // Remove password field if it is not set in the request

        //Password hashing issue, please fix

        $response = Http::patch("{$this->companiesApiUrl}/{$id}", $data);

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
        $response = Http::delete("{$this->companiesApiUrl}{$id}");


        return redirect()->back()->with('success', 'Bedrijf succesvol verwijderd!');
    }
}
