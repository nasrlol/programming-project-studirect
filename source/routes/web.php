<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {return view('welcome');});

//StudentData
Route::get('/students', [StudentController::class, 'showAll']);
//Makes a student
Route::post('/students', [StudentController::class, 'store'])->name('students.create');
//Gives specified student and all company data, to be used by Student page
//Note: security must be fixed
Route::get('/students/{id}', [StudentController::class, 'show']);
//Changes a student
Route::put('/students/{id}', [StudentController::class, 'update' ]);

Route::get('/company', function () {
    return view('company.company'); // zoekt 'resources/views/home.blade.php'
});

//Route for companies to be created
Route::post('/companies', [CompanyController::class, 'store'])->name('companies.create');

Route::delete('/companies/{id}', [CompanyController::class, 'destroy'])->name('companies.delete');
Route::delete('/students/{id}', [StudentController::class, 'destroy'])->name('students.delete');


Route::get('/admin', [AdminController::class, 'show']);