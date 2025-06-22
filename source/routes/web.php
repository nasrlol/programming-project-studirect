<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\loginstudent\ForgotPasswordController;
use App\Http\Controllers\loginstudent\LoginController;
use App\Http\Controllers\RegistrationStudentController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ConnectionController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MatchController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', fn () => view('welcome'))->name('home');


// =======================
// LOGIN / LOGOUT ROUTES
// =======================

// GET loginpagina (één formulier voor student & bedrijf)
Route::get('/student/login', fn () => view('login.login'))->name('student.login.form');

// POST login (stuurt naar frontend LoginController)
Route::post('/student/login', [LoginController::class, 'submit'])->name('student.login');

// LOGOUT (via API logout + sessie leegmaken)
Route::post('/logout', function (Request $request) {
    try {
        Http::withToken(session('api_token'))->post('http://10.2.160.208/api/logout');
    } catch (\Exception $e) {
        report($e);
    }
    session()->forget('api_token');
    return redirect()->route('student.login.form');
})->name('logout');


// =======================
// STUDENT REGISTRATIE (3 stappen)
// =======================

Route::get('/student/register', fn () => view('student.register.register1'))->name('student.register.form');

Route::get('/student/register1', fn () => view('student.register.register1'))->name('student.register.step1');
Route::post('/student/register1', [RegistrationStudentController::class, 'step1'])->name('student.register.step1.submit');

Route::get('/student/register2', fn () => view('student.register.register2'))->name('student.register.step2');
Route::post('/student/register2', [RegistrationStudentController::class, 'step2'])->name('student.register.step2.submit');

Route::get('/student/register3', fn () => view('student.register.register3'))->name('student.register.step3');
Route::post('/student/register3', [RegistrationStudentController::class, 'submit'])->name('student.register.step3.submit');


// =======================
// STUDENT & COMPANY PAGES
// =======================

Route::get('/student/{id}', [StudentController::class, 'index'])->name('student.show');
Route::get('/students/{id}', [StudentController::class, 'index']);
Route::get('/students', [StudentController::class, 'indexTest']);

Route::get('/company/{id}', [CompanyController::class, 'index'])->name('company.show');
Route::get('/companies/{id}', [CompanyController::class, 'index']);
Route::get('/company', [CompanyController::class, 'indexTest'])->name('company.index');
Route::get('/companies', [CompanyController::class, 'indexTest'])->name('companies.index');


// =======================
// CRUD: STUDENTS & COMPANIES
// =======================

Route::post('/students', [StudentController::class, 'store'])->name('students.create');
Route::post('/companies', [CompanyController::class, 'store'])->name('companies.create');

Route::patch('/student/{id}', [StudentController::class, 'update']);
Route::patch('/students/{id}', [StudentController::class, 'update']);
Route::patch('/company/{id}', [CompanyController::class, 'update']);
Route::patch('/companies/{id}', [CompanyController::class, 'update']);

Route::delete('/students/{id}', [StudentController::class, 'destroy'])->name('students.delete');
Route::delete('/companies/{id}', [CompanyController::class, 'destroy'])->name('companies.delete');


// =======================
// ADMIN
// =======================

Route::get('/admin', [AdminController::class, 'show']);


// =======================
// APPOINTMENTS & CONNECTIONS
// =======================

Route::post('/appointments', [AppointmentController::class, 'store']);
Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);

Route::post('/connections', [ConnectionController::class, 'makeConnection']);
Route::patch('/connections/{id}', [ConnectionController::class, 'removeConnection']);

// =======================
// MESSAGES
// =======================

Route::post('/messages/send', [MessageController::class, 'sendMessage'])->name('messages.send');
Route::post('/messages/conversation', [MessageController::class, 'getConversation']);
Route::post('/companies/{id}/messages/send', [CompanyController::class, 'sendMessage'])->name('company.messages.send');


// =======================
// MATCH API
// =======================

Route::get('/api/match/{student_id}/{company_id}', [MatchController::class, 'getMatchPercentage']);
Route::post('/api/matches/{student_id}', [MatchController::class, 'getMultipleMatches']);

// =======================
// PASSWORD RESET (student)
// =======================

Route::get('/student/password/reset', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('student.password.request');
Route::post('/student/password/email', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('student.password.email');


