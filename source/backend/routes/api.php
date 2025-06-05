<?php

use App\Http\Controllers\AppointementController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CompanyController;

// studenten routes
Route::get('/students', [StudentenController::class, 'index']);
Route::post('/students', [StudentenController::class, 'store']);
Route::get('/students/{id}', [StudentenController::class, 'show']);
Route::put('/students', [StudentenController::class, 'update']);
Route::delete('/students', [StudentenController::class, 'destroy']);

// company routes
Route::get('/companys', [CompanyController::class, 'index']);
Route::post('/companys', [CompanyController::class, 'store']);
Route::get('/companys/{id}', [CompanyController::class, 'show']);
Route::put('/companys', [CompanyController::class, 'update']);
Route::delete('/companys', [CompanyController::class, 'destroy']);

// appointement routes
Route::get('/appointements', [AppointementController::class, 'index']);
Route::post('/appointements', [AppointementController::class, 'store']);
Route::get('/appointements/{id}', [AppointementController::class, 'show']);
Route::put('/appointements', [AppointementController::class, 'update']);
Route::delete('/appointements', [AppointementController::class, 'destroy']);

