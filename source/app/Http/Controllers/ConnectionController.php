<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ConnectionController extends Controller
{
    //
    public function makeConnection(Request $request)
    {
        $data = $request->validate([
            'student_id' => 'required|integer|exists:student,student_id',
            'company_id' => 'required|integer|exists:company,company_id',
            'status'=> 'required|boolean'
        ]);

        $response = Http::post($this->connectionsApiUrl , $data);

        if(!$response->successful()) {
            return redirect()->back()->with('error', 'Er is een fout opgetreden bij het maken van de match.');
        }

        return redirect()->back()->with('succes', 'Gematched met bedrijf ${$this->translateCompany($request["company_id"}!');
    }
}
