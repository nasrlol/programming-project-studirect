<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    protected string $apiUrl;

    public function __construct()
    {
        $this->apiUrl = config('services.api.base_url', 'http://10.2.160.208/api');
    }

    public function submit(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        try {
            $response = Http::timeout(5)
                ->acceptJson()
                ->post("{$this->apiUrl}/login", [
                    'email' => $validated['email'],
                    'password' => $validated['password'],
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $token = $data['token'] ?? null;
                $userType = $data['user_type'] ?? null;
                $userId = $data['user']['id'] ?? null;

                if (!$token || !$userType || !$userId) {
                    return back()->withErrors(['email' => 'Ongeldige response van de loginservice.'])->withInput();
                }

                session(['api_token' => $token]);

                // Doorverwijzen op basis van type
                if ($userType === 'student') {
                    return redirect("/student/{$userId}");
                } elseif ($userType === 'company') {
                    return redirect("/company/{$userId}");
                } elseif ($userType === 'admin') {
                    return redirect("/admin");
                } else {
                    return back()->withErrors(['email' => 'Onbekend gebruikerstype.'])->withInput();
                }
            }

            return back()->withErrors(['email' => 'Ongeldige inloggegevens.'])->withInput();

        } catch (\Exception $e) {
            Log::error('Login error', ['message' => $e->getMessage()]);
            return back()->withErrors(['email' => 'Loginservice tijdelijk niet beschikbaar.'])->withInput();
        }
    }
}