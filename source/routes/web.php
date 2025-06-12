<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

Route::get('/', [StudentController::class, 'index']);

Route::get('/students', [StudentController::class, 'index']);
//Route::post('/students', [StudentController::class, 'store']);

Route::get('/company', function () {
    return view('company.company'); // zoekt 'resources/views/home.blade.php'
});

Route::get('/admin', [AdminController::class, 'show']);

//Route for admin to add a company
Route::post('/companies', [CompanyController::class, 'store'])->name('companies.create');
