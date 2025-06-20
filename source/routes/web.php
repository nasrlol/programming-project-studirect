<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\Student\ForgotPasswordController;
use App\Http\Controllers\RegistrationStudentController;
use App\Http\Controllers\loginstudent\LoginController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ConnectionController;
use App\Http\Controllers\MessageController;

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


Route::get('/admin', [AdminController::class, 'show']);


//route voor login scherm
// GET loginpagina
Route::get('/student/login', function () {
    return view('login.login');
})->name('student.login.form');

// POST login
Route::post('/student/login', [LoginController::class, 'submit'])->name('student.login');

Route::get('/student/register', function () {
    return view('student.register.register1');
})->name('student.register.form');


//login doorsturen naar student pagina
Route::get('/student', function () {
    return view('student.html.student');
})->name('student.html.student');


//forgot password for student
Route::get('/student/password/reset', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('student.password.request');
Route::post('/student/password/email', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('student.password.email');


// Registratie stap 1
Route::get('/student/register1', function () {
    return view('student.register.register1');
})->name('student.register.step1');

Route::post('/student/register1', [RegistrationStudentController::class, 'step1'])->name('student.register.step1.submit');


// Registratie stap 2
Route::get('/student/register2', function () {
    return view('student.register.register2');
})->name('student.register.step2');

Route::post('/student/register2', [RegistrationStudentController::class, 'step2'])->name('student.register.step2.submit');

// Registratie stap 3
Route::get('/student/register3', function () {
    return view('student.register.register3');
})->name('student.register.step3');

Route::post('/student/register3', [RegistrationStudentController::class, 'submit'])->name('student.register.step3.submit');


Route::get('/test-controller', [RegistrationStudentController::class, 'debug']);


Route::get('/test-class-load', function () {
    $controller = new \App\Http\Controllers\RegistrationStudentController();
    return "Controller loaded successfully: " . get_class($controller);
});

//Routes for messages
//Link code chatGPT: https://chatgpt.com/share/684fd09e-f0c0-8005-90e4-9f3e6d9cbdee
Route::post('/messages/send', [MessageController::class, 'sendMessage'])->name('messages.send');
Route::post('/messages/conversation', [MessageController::class, 'getConversation']);

Route::post('/companies/{id}/messages/send', [CompanyController::class, 'sendMessage'])->name('company.messages.send');
