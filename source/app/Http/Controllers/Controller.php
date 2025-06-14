<?php

namespace App\Http\Controllers;


abstract class Controller
{
    // API URLs for appointments, students, and companies
    protected $appointmentApiUrl = 'http://10.2.160.208/api/appointments';
    protected string $studentsApiUrl = 'http://10.2.160.208/api/students';
    protected string $companiesApiUrl = 'http://10.2.160.208/api/companies';
}
