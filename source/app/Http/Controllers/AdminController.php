<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Http;

class AdminController extends Controller
{

    private string $apiUrl = 'http://10.2.160.208/api/';

    public function showAllUsers(): View
{
    try {
        $apiStudents = $this->apiUrl . 'students';
        $apiCompanies = $this->apiUrl . 'companies';
        $response = Http::get($apiStudents);
        if (!$response->successful()) {
            dd('API niet beschikbaar');
            return view('voorbeeld.index', ['error' => 'API niet beschikbaar', 'students' => []]);
        }
        $students = $response->json('data');

        //Second response for companies
        $response = Http::get($apiCompanies);
        if (!$response->successful()) {
            dd('API niet beschikbaar');
            return view('voorbeeld.index', ['error' => 'API niet beschikbaar', 'students' => []]);
        }
        $companies = $response->json('data');

        return view('/admin/admin', [
            'students' => $students, 
            'companies' => $companies
    ]);
    } catch (\Exception $e) {
        dd('failure');
        return view('voorbeeld.index', ['error' => 'Er is een fout opgetreden', 'students' => []]);
    }
}
}
