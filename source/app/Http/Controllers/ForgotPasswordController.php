<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Company;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ForgotPasswordController extends Controller
{
   public function showLinkRequestForm()
    {
        return view('student.register.email');
    }

    public function sendResetLinkEmail(Request $request)
    {
        // Valideer het e-mailadres
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = $request->email;
        $id = null;

        // Zoek student of bedrijf
        $student = Student::where('email', $email)->first();
        if ($student) {
            $id = $student->id;
        } else {
            $company = Company::where('email', $email)->first();
            if ($company) {
                $id = $company->id;
            } else {
                return back()->withErrors([
                    'email' => 'Dit e-mailadres hoort niet bij een geregistreerde student of bedrijf.'
                ]);
            }
        }

        // Probeer herstelmail te versturen
        try {
            $url = "http://10.2.160.208/api/reset/mail/{$id}";
            Log::info("Versturen van herstelmail naar ID: $id via $url");

            $response = Http::timeout(10)->post($url);

            if ($response->successful()) {
                return back()->with('status', 'Als dit e-mailadres bij ons bekend is, ontvang je een herstelmail.');
            } else {
                Log::error("Herstelmail fout: " . $response->body());
                return back()->withErrors([
                    'email' => 'Er ging iets mis bij het versturen van de herstelmail.'
                ]);
            }
        } catch (\Exception $e) {
            Log::error("Fout bij resetmail: " . $e->getMessage());
            return back()->withErrors([
                'email' => 'Serverfout bij het versturen van de herstelmail. Probeer het later opnieuw.'
            ]);
        }
    }
}