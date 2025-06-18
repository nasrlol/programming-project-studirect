<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ConnectionController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {return view('welcome');});

//StudentData
Route::get('/students', [StudentController::class, 'indexTest']);
//Gives specified student and all company data, to be used by Student page
//Note: security must be fixed
Route::get('/student/{id}', [StudentController::class, 'index']);
Route::get('/students/{id}', [StudentController::class, 'index']);

//TestCompany will be used in this get, afterwards second GET with ID will be used
Route::get("/company/", [CompanyController::class, 'indexTest'])->name('company.index');
Route::get("/companies/", [CompanyController::class, 'indexTest'])->name('companies.index');

Route::get("/company/{id}", [CompanyController::class, 'index'])->name('company.show');
Route::get("/companies/{id}", [CompanyController::class, 'index'])->name('companies.show');


//Route for companies to be created
Route::post('/companies', [CompanyController::class, 'store'])->name('companies.create');
//Makes a student
Route::post('/students', [StudentController::class, 'store'])->name('students.create');

Route::patch('/students/{id}', [StudentController::class, 'update']);
Route::patch('/student/{id}', [StudentController::class, 'update']);
Route::patch('/companies/{id}', [CompanyController::class, 'update']);
Route::patch('/company/{id}', [CompanyController::class, 'update']);

//route for deleting a company or student
Route::delete('/companies/{id}', [CompanyController::class, 'destroy'])->name('companies.delete');
Route::delete('/students/{id}', [StudentController::class, 'destroy'])->name('students.delete');


Route::get('/admin', [AdminController::class, 'show']);
Route::get('/admin?cursor={$cursor}', [AdminController::class, 'show']);

//Getting appointments goes via other controller, so this is not needed here
//route for making appointments
Route::post('/appointments', [AppointmentController::class, 'store']);
//route for updating appointments
Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
//route for deleting appointments
Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);


//Route for making a connection between student and company
Route::post('/connections', [ConnectionController::class, 'makeConnection']);
Route::patch('/connections/{id}', [ConnectionController::class, 'removeConnection']);

//Routes for messages
//Link code chatGPT: https://chatgpt.com/share/684fd09e-f0c0-8005-90e4-9f3e6d9cbdee
Route::post('/messages/send', [MessageController::class, 'sendMessage'])->name('messages.send');
Route::post('/messages/conversation', [MessageController::class, 'getConversation']);
Route::post('/companies/{id}/messages/send', [CompanyController::class, 'sendMessage'])->name('company.messages.send');
