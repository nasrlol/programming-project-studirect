<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Student::factory()->count(10)->create();

    }
}
