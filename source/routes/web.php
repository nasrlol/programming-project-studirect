<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {return view('welcome');});

//StudentData
Route::get('/students', [StudentController::class, 'indexTest']);
//Gives specified student and all company data, to be used by Student page
//Note: security must be fixed
Route::get('/students/{id}', [StudentController::class, 'index']);

//TestCompany will be used in this get, afterwards second GET with ID will be used
Route::get("/companies/", [CompanyController::class, 'indexTest'])->name('companies.index');

Route::get("/companies/{id}", [CompanyController::class, 'index'])->name('companies.index');


//Route for companies to be created
Route::post('/companies', [CompanyController::class, 'store'])->name('companies.create');
//Makes a student
Route::post('/students', [StudentController::class, 'store'])->name('students.create');

Route::patch('/students/{id}', [StudentController::class, 'update' ]);
Route::patch('/companies/{id}', [StudentController::class, 'update' ]);

//route for deleting a company or student
Route::delete('/companies/{id}', [CompanyController::class, 'destroy'])->name('companies.delete');
Route::delete('/students/{id}', [StudentController::class, 'destroy'])->name('students.delete');


Route::get('/admin', [AdminController::class, 'show']);