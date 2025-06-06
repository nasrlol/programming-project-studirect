<?php

/*use App\Http\Controllers\AppointementController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CompanyController;*/
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StudentController;  // Met Api namespace
use App\Http\Controllers\Api\CompanyController;  // Met Api namespace
use App\Http\Controllers\Api\AppointementController;  // Met Api namespace

// studenten routes
Route::get('/students', [StudentController::class, 'index']);
Route::post('/students', [StudentController::class, 'store']);
Route::get('/students/{id}', [StudentController::class, 'show']);
Route::put('/students/{id}', [StudentController::class, 'update']);
Route::delete('/students/{id}', [StudentController::class, 'destroy']);

// company routes
Route::get('/companys', [CompanyController::class, 'index']);
Route::post('/companys', [CompanyController::class, 'store']);
Route::get('/companys/{id}', [CompanyController::class, 'show']);
Route::put('/companys', [CompanyController::class, 'update']);
Route::delete('/companys', [CompanyController::class, 'destroy']);

// appointement routes
/*
Route::get('/appointements', [App::class, 'index']);
Route::post('/appointements', [AppointmentController::class, 'store']);
Route::get('/appointements/{id}', [AppointmentController::class, 'show']);
Route::put('/appointements', [AppointmentController::class, 'update']);
Route::delete('/appointements', [AppointmentController::class, 'destroy']);
*/



// Test route
Route::get('/test', function() {
    return response()->json(['message' => 'API works!']);
});
