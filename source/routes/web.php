<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\Student\ForgotPasswordController;
use App\Http\Controllers\RegistrationStudentController;
use App\Http\Controllers\loginstudent\LoginController;
use Illuminate\Support\Facades\Route;


Route::get('/', [StudentController::class, 'index']);

Route::get('/students', [StudentController::class, 'index']);
//Route::post('/students', [StudentController::class, 'store']);
Route::post('/students', [StudentController::class, 'store'])->name('students.create');

Route::get('/company', function () {
    return view('company.company'); // zoekt 'resources/views/home.blade.php'
});

//Route for admin to add a company
Route::post('/companies', [CompanyController::class, 'store'])->name('companies.create');

Route::delete('/companies/{id}', [CompanyController::class, 'destroy'])->name('companies.delete');


Route::get('/admin', [AdminController::class, 'show']);


//route voor login scherm
// GET loginpagina
Route::get('/student/login', function () {
    return view('student.login_register.loginstudent');
})->name('student.loginstudent.form');

// POST login
Route::post('/student/login', [LoginController::class, 'submit'])->name('student.login');


//forgot password for student
Route::get('/student/password/reset', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('student.password.request');
Route::post('/student/password/email', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('student.password.email');


// Registratie stap 1
Route::get('/student/register1', function () {
    return view('student.login_register.register1');
})->name('student.register.step1');

Route::post('/student/register1', [RegistrationStudentController::class, 'step1'])->name('student.register.step1.submit');


// Registratie stap 2
Route::get('/student/register2', function () {
    return view('student.login_register.register2');
})->name('student.register.step2');

Route::post('/student/register2', [RegistrationStudentController::class, 'step2'])->name('student.register.step2.submit');

// Registratie stap 3
Route::get('/student/register3', function () {
    return view('student.login_register.register3');
})->name('student.register.step3');

Route::post('/student/register3', [RegistrationStudentController::class, 'submit'])->name('student.register.step3.submit');


Route::get('/test-controller', [RegistrationStudentController::class, 'debug']);


Route::get('/test-class-load', function () {
    return new \App\Http\Controllers\RegistrationStudentController();
});
