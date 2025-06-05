<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\CompanyController;

// studenten routes
Route::get('/students', [StudentController::class, 'index']);
Route::post('/students', [StudentController::class, 'store']);
Route::get('/students/{id}', [StudentController::class, 'show']);
Route::put('/students', [StudentController::class, 'update']);
Route::delete('/students', [StudentController::class, 'destroy']);

// company routes
Route::get('/companys', [CompanyController::class, 'index']);
Route::post('/companys', [CompanyController::class, 'store']);
Route::get('/companys/{id}', [CompanyController::class, 'show']);
Route::put('/companys', [CompanyController::class, 'update']);
Route::delete('/companys', [CompanyController::class, 'destroy']);

// appointement routes
Route::get('/appointements', [AppointmentController::class, 'index']);
Route::post('/appointements', [AppointmentController::class, 'store']);
Route::get('/appointements/{id}', [AppointmentController::class, 'show']);
Route::put('/appointements', [AppointmentController::class, 'update']);
Route::delete('/appointements', [AppointmentController::class, 'destroy']);

