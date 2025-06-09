<?php

use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

Route::get('/', [StudentController::class, 'index']);

Route::get('/students', [StudentController::class, 'index']);
<<<<<<< Updated upstream
//Route::post('/students', [StudentController::class, 'store']);
=======
//Route::post('/students', [StudentController::class, 'store']);

Route::get('/company', function () {
    return view('company'); // zoekt 'resources/views/home.blade.php'
});
/*
Route::prefix('admin')->group(function () {
    // Admin homepage route 
    Route::get('/', function () {
        return view('admin/html/admin', [StudentController::class, 'showAllStudents']);
    });
});
*/
Route::get('/admin', [StudentController::class, 'showAllStudents']);
>>>>>>> Stashed changes
