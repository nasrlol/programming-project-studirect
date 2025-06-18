<?php

namespace App\Http\Controllers\Loginstudent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LoginController extends Controller
{
    private string $ApiUrlstudent = 'http://10.2.160.208/api/students/login';
    private string $apiUrlcompany = 'http://10.2.160.208/api/companies/';

    public function submit(Request $request)
    {
        // Validatie van invoer
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // 1. Probeer student API
        $studentResponse = Http::asForm()->post($this->ApiUrlstudent, [
            'email' => $request->email,
            'password' => $request->password
        ]);
        \Log::info('Student Login API status: ' . $studentResponse->status());
        \Log::info('Student Login API body: ' . $studentResponse->body());

        if ($studentResponse->successful()) {
            $data = $studentResponse->json();
            if (is_array($data) && isset($data['user_type']) && $data['user_type'] === 'student') {
                $companies = [];
                return view('student.html.student', compact('companies'))->with('status', 'Ingelogd als student (API)!');
            }
        }

        // 2. Probeer company API
        $companyResponse = Http::asForm()->post($this->apiUrlcompany . 'login', [
            'email' => $request->email,
            'password' => $request->password
        ]);
        \Log::info('Company Login API status: ' . $companyResponse->status());
        \Log::info('Company Login API body: ' . $companyResponse->body());

        if ($companyResponse->successful()) {
            $data = $companyResponse->json();
            if (is_array($data) && isset($data['user_type']) && $data['user_type'] === 'company') {
                $companies = [
                    [
                        'name' => $data['company']['name'] ?? 'Onbekend bedrijf',
                        'photo' => $data['company']['photo'] ?? 'default_logo.png'
                    ]
                ];
                return view('company.company', compact('companies'))->with('status', 'Ingelogd als bedrijf (API)!');
            }
        }

        // 3. Nergens gevonden
        return redirect()->back()->withErrors(['login' => 'Login mislukt.'])->withInput();
    }
}