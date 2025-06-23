<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RegistrationStudentController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ConnectionController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\SkillsToevoegenController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', fn () => view('welcome'))->name('home');


// =======================
// LOGIN / LOGOUT ROUTES
// =======================

// GET/ pOSTloginpagina (één formulier voor student & bedrijf)
Route::get('/login', fn () => view('login.login'))->name('login.login');
Route::post('/login', [LoginController::class, 'submit'])->name('login.login');

// LOGOUT (via API logout + sessie leegmaken)
Route::post('/logout', function (Request $request) {
    try {
        Http::withToken(session('api_token'))->post('http://10.2.160.208/api/logout');
    } catch (\Exception $e) {
        report($e);
    }
    session()->forget('api_token');
    return redirect()->route('login.form');
})->name('logout');


// =======================
// STUDENT REGISTRATIE (3 stappen)
// =======================

Route::get('/student/register', fn () => view('student.register.register1'))->name('student.register.form');

Route::get('/student/register1', fn () => view('student.register.register1'))->name('student.register.step1');
Route::post('/student/register1', [RegistrationStudentController::class, 'step1'])->name('student.register.step1.submit');

Route::get('/student/register2', [RegistrationStudentController::class, 'showStep2'])->name('student.register.step2');
Route::post('/student/register2', [RegistrationStudentController::class, 'step2'])->name('student.register.step2.submit');

Route::get('/student/register3', fn () => view('student.register.register3'))->name('student.register.step3');
Route::post('/student/register3', [RegistrationStudentController::class, 'submit'])->name('student.register.step3.submit');

Route::get('/student/{id}/skills', [SkillsToevoegenController::class, 'showSkillsForm'])->name('student.skills.add');
Route::post('/student/{id}/skills', [SkillsToevoegenController::class, 'saveSkills'])->name('student.skills.save');

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
Route::patch('/students/{id}', [StudentController::class, 'update'])->name('students.change');
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
Route::get('/connections/{id}', [ConnectionController::class, 'getConnectionsForStudent']);

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
// PASSWORD RESET
// =======================

Route::get('/password/reset', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('student.password.request');
Route::post('/password/email', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('student.password.email');


// =======================
// TEST ROUTES
// =======================

Route::get('/test-controller', [RegistrationStudentController::class, 'debug']);
Route::get('/test-class-load', fn () => "Controller loaded: " . get_class(new \App\Http\Controllers\RegistrationStudentController()));
Route::get('/test-notfound', fn () => view('notfound', ['message' => 'Testmelding werkt.']));

// API endpoint voor appointments (alle afspraken)
Route::get('/api/appointments', function(Request $request) {
    require_once __DIR__.'/student_name_helper.php';
    $appointments = [
        [
            'student_id' => 1,
            'company_id' => 61,
            'time_start' => '10:15:00',
            'time_end' => '10:30:00',
        ]
    ];
    // Voeg student_name toe aan elke afspraak
    foreach ($appointments as &$appointment) {
        $appointment['student_name'] = getStudentName($appointment['student_id']);
    }
    unset($appointment);
    return response()->json(['data' => $appointments]);
});

