<?php
namespace App\Http\Controllers\Loginstudent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LoginController extends Controller
{
    public function submit(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $response = Http::post('https://api.jouwdomein.com/api/student/login', [
            'email' => $request->email,
            'password' => $request->password
        ]);

        if ($response->successful()) {
            // hier kun je eventueel session/token opslaan
            return redirect()->route('student.dashboard')->with('status', 'Ingelogd!');
        }

        return back()->withErrors(['email' => 'Login mislukt'])->withInput();
    }
}
