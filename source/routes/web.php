<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;

Route::get('/', [StudentController::class, 'index']);

Route::get('/students', [StudentController::class, 'index']);
//Route::post('/students', [StudentController::class, 'store']);

Route::get('/company', function () {
    return view('company.company'); // zoekt 'resources/views/company/company.blade.php'
});

Route::get('/admin', [AdminController::class, 'showAllUsers']);

/*messages routes*/ 
Route::get('/messages', [MessageController::class, 'index']);
Route::get('/messages/{id}', [MessageController::class, 'show']);
Route::post('/messages', [MessageController::class, 'store']);
Route::put('/messages/{id}', [MessageController::class, 'update']);
Route::delete('/messages/{id}', [MessageController::class, 'destroy']);

Route::post('/messages/send', [MessageController::class, 'send']);
